#!/usr/bin/env python3
"""PostToolUse detector: staging without a commit-log entry.

`design/commit-log.md` holds the *why* of each commit, because this repository's commits are
subject-only by choice — measured 2026-08-30: all 140 of them. Every commit body ever written was
discarded, so if the reasoning is not in the log before the commit, it is gone.

`scripts/commit-log.sh` catches an entry whose hash was never filled in. It cannot catch the other
failure: **no entry written at all.** Nothing noticed that, ever. This hook is that half — it fires
at `git add`, which is the moment the convention says the entry is due (C30's census found that
proximity between the reminder and the moment is what predicts whether a rule holds).

Contract (Claude Code PostToolUse hook):
  - stdin: JSON with tool_name and tool_input.command
  - silent pass: exit 0, no output
  - flag:        exit 0, print JSON with hookSpecificOutput.additionalContext

It also **fills the hash left `<pending>` by the previous commit and re-stages the log**, because the
convention is "fill it in at the next staging" — not after committing. Doing it as a separate step
leaves commit-log.md as a dangling diff every time, which needs its own commit, its own entry, its
own fix. Done here, the filled hash rides along inside the commit being staged.

Detects, does not block. A PostToolUse hook runs after the action, and staging in several passes is
normal working practice — interrupting it would be noise. It reports; the session decides.

**Silent when the repository does not use the convention** (no `design/commit-log.md`). That guard is
what makes this safe to ship into projects later (C36): a project that never adopts the log never
sees a warning.

Fail-open on any error, matching guard-designer-md.py — a malformed payload or a missing git must
never wedge staging.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

# Match the ENTRY FORM at the start of a line, not the bare string. The file's own header
# documents the convention by quoting `<pending>`, so a substring check matches that prose and
# the hook goes permanently blind — reporting "an entry exists" on every commit forever. Caught
# in pipe-testing before this shipped; it is the same failure mode commit-log.sh guards with its
# matcher self-check, and the same shape as the `instrument` defect class.
PENDING_ENTRY = re.compile(r"^- `<pending>` ", re.M)


def silent():
    sys.exit(0)


def flag(message: str):
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": message,
        }
    }))
    sys.exit(0)


def git(*args: str, cwd: str) -> str:
    return subprocess.run(
        ["git", *args], capture_output=True, text=True, timeout=10, cwd=cwd
    ).stdout.strip()


# Which repo did the command stage INTO? The hook process runs in the session's cwd, but the
# command may have moved first: `cd /projects/md2pdf; git add …` or `git -C /projects/md2pdf add …`.
# 2026-09-13: staging md2pdf from a workbench session ran the fill against the WORKBENCH repo —
# the wrong one — and re-staged its log with nothing to ride on. Resolve the directory the
# `git add` actually ran in and do everything there; the existing "no design/commit-log.md"
# guard then keeps the hook silent in a project that does not use the convention.
#
# ponytail: a text scan of the command, not a shell parse. Handles `cd X`, `cd X &&`, `(cd X;`,
# `git -C X add`, and the LAST cd before `git add` wins. ceiling: chained relative cds
# (`cd a; cd b; git add`) resolve `b` against the session cwd, not `a`. upgrade: track the chain
# if that ever appears in practice.
CD_BEFORE_ADD = re.compile(r"(?:^|[;&|(]\s*)cd\s+(?P<dir>\"[^\"]+\"|'[^']+'|[^\s;&|)]+)")
GIT_C_ADD = re.compile(r"git\s+-C\s+(?P<dir>\"[^\"]+\"|'[^']+'|[^\s;&|)]+)\s+add\b")
# Both spellings of "this command stages". A bare substring test for "git add" was blind to
# `git -C <dir> add`, which is the natural way to stage another repo without leaving this one.
GIT_ADD = re.compile(r"\bgit\s+(?:-C\s+(?:\"[^\"]+\"|'[^']+'|[^\s;&|)]+)\s+)?add\b")


def target_dir(command: str, cwd: str) -> str:
    """The directory the `git add` in `command` ran in, resolved against the session cwd."""
    m = GIT_C_ADD.search(command)
    if m:
        d = m.group("dir").strip("\"'")
    else:
        last = None
        for last in CD_BEFORE_ADD.finditer(command[: GIT_ADD.search(command).start()]):
            pass
        if last is None:
            return cwd
        d = last.group("dir").strip("\"'")
    return os.path.normpath(os.path.join(cwd, os.path.expanduser(d)))


# Self-check, same reasoning as PENDING_ENTRY: a resolver that quietly falls back to the session
# cwd is the exact bug it replaces, wearing a comment that says it was fixed.
for _cmd, _sees in [("git add x", True), ("git -C /p/m add x", True), ("cd /p; git add .", True),
                    ("git status", False), ("git -C /p/m status", False), ("echo git added", False)]:
    if bool(GIT_ADD.search(_cmd)) != _sees:
        print(f"commit-log hook: GIT_ADD is wrong for {_cmd!r}", file=sys.stderr)
        sys.exit(0)
for _cmd, _want in [
    ("git add x", "/w"),
    ("cd /p/m; git add x", "/p/m"),
    ("cd /p/m && git add x", "/p/m"),
    ("(cd /p/m; git add x)", "/p/m"),
    ("git -C /p/m add x", "/p/m"),
    ("cd /p/a; ls; cd /p/b && git add x", "/p/b"),
    ("cd sub; git add x", "/w/sub"),
    ("cd /p/m; git add x; cd /w", "/p/m"),
    ('cd "/p/with space"; git add x', "/p/with space"),
]:
    if target_dir(_cmd, "/w") != _want:
        print(f"commit-log hook: target_dir is wrong for {_cmd!r}: {target_dir(_cmd, '/w')!r} != {_want!r}", file=sys.stderr)
        sys.exit(0)  # fail-open: never wedge staging, but say so on stderr


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        silent()

    command = (payload.get("tool_input") or {}).get("command", "")
    if not GIT_ADD.search(command):
        silent()

    filled = ""
    try:
        target = target_dir(command, payload.get("cwd") or os.getcwd())
        if not os.path.isdir(target):
            silent()  # could not resolve where the add ran; do nothing rather than guess a repo
        root = git("rev-parse", "--show-toplevel", cwd=target)
        if not root:
            silent()

        log = Path(root) / "design" / "commit-log.md"
        if not log.is_file():
            silent()  # this repo does not use the convention

        # Fill any hash left `<pending>` by the PREVIOUS commit, then re-stage the log.
        #
        # The convention is "fill it in at the next staging" — not after committing. Running the fix
        # as its own step leaves commit-log.md as a dangling diff every single time, which then needs
        # its own commit, its own entry, its own fix. Doing it here means the filled hash rides along
        # inside the commit being staged right now, and the treadmill disappears.
        #
        # Safe because `--fix` only resolves entries whose commit ALREADY EXISTS: the `<pending>` just
        # written for the commit being prepared is left alone. Same guard that lets verify.sh gate on
        # this without failing between staging and committing.
        fixer = Path(root) / "scripts" / "commit-log.sh"
        if fixer.is_file():
            out = subprocess.run(
                ["bash", str(fixer), "--fix"], capture_output=True, text=True, timeout=20, cwd=root,
            ).stdout
            if "filled in" in out:
                git("add", str(log), cwd=root)
                hashes = [ln.strip() for ln in out.splitlines() if ln.startswith("  ")]
                filled = (
                    "commit-log: filled the hash left pending by the previous commit and re-staged "
                    "design/commit-log.md — it rides along with this one.\n  "
                    + "\n  ".join(hashes) + "\n\n"
                )

        staged = git("diff", "--cached", "--name-only", cwd=root)
        if not staged:
            silent()  # nothing staged, nothing to record

        if PENDING_ENTRY.search(log.read_text(encoding="utf-8")):
            if filled:
                flag(filled.rstrip())
            silent()  # an entry is already waiting for this commit

        count = len(staged.splitlines())
    except Exception:
        silent()

    flag(
        f"{filled}"
        f"commit-log ({root}): {count} file(s) are staged and design/commit-log.md has no "
        f"`<pending>` entry. This repository's commits are subject-only, so a commit body "
        f"is discarded — the reasoning survives only if it is written here BEFORE the commit. "
        f"Add an entry now (newest last, under 'Live entries'):\n\n"
        f"- `<pending>` **<the exact commit subject you will use>**\n"
        f"  <why: the reasoning, the alternatives rejected, the numbers measured — not the diff>\n\n"
        f"Then re-stage design/commit-log.md."
    )


if __name__ == "__main__":
    main()
