// Functional core: turn (registry + selected id + env) into the concrete form spec a component
// renders. Pure — no Astro, no DOM, no I/O — so it is unit-tested without standing up the world.
// Fail-fast on a misconfigured service id or a missing form id (prior art: fail-fast-env-validation).

import {
  WAITLIST_SERVICES,
  WAITLIST_SERVICE_IDS,
  DEFAULT_WAITLIST_SERVICE,
  type WaitlistServiceId,
  type WaitlistService,
} from '../config/waitlist';

/** What a form needs to render, provider-agnostic. */
export interface WaitlistFormSpec {
  readonly serviceId: WaitlistServiceId;
  readonly action: string;
  readonly method: 'POST';
  readonly emailFieldName: string;
  readonly hiddenFields: Readonly<Record<string, string>>;
}

export class WaitlistConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WaitlistConfigError';
  }
}

function isServiceId(value: string | undefined): value is WaitlistServiceId {
  return value !== undefined && (WAITLIST_SERVICE_IDS as readonly string[]).includes(value);
}

/** Resolve the active service id from a raw env value, falling back to the launch default. */
export function resolveServiceId(raw: string | undefined): WaitlistServiceId {
  const trimmed = raw?.trim();
  if (!trimmed) return DEFAULT_WAITLIST_SERVICE;
  if (!isServiceId(trimmed)) {
    throw new WaitlistConfigError(
      `Unknown PUBLIC_WAITLIST_SERVICE "${trimmed}". Expected one of: ${WAITLIST_SERVICE_IDS.join(', ')}.`,
    );
  }
  return trimmed;
}

/**
 * Build the concrete form spec for a service. `env` is a plain map (import.meta.env at the call
 * site), kept as a parameter so the core stays pure and testable.
 */
export function buildWaitlistForm(
  serviceId: WaitlistServiceId,
  env: Readonly<Record<string, string | undefined>>,
): WaitlistFormSpec {
  const service: WaitlistService = WAITLIST_SERVICES[serviceId];
  const formId = env[service.idEnvKey]?.trim();
  if (!formId) {
    throw new WaitlistConfigError(
      `Missing ${service.idEnvKey} for the "${service.label}" waitlist. Set it in .env (see .env.example).`,
    );
  }
  return {
    serviceId,
    action: service.actionTemplate.replace('{id}', encodeURIComponent(formId)),
    method: 'POST',
    emailFieldName: service.emailFieldName,
    hiddenFields: service.hiddenFields,
  };
}

/** Convenience: resolve the id from env and build its spec in one step. */
export function resolveWaitlistForm(
  env: Readonly<Record<string, string | undefined>>,
): WaitlistFormSpec {
  return buildWaitlistForm(resolveServiceId(env.PUBLIC_WAITLIST_SERVICE), env);
}
