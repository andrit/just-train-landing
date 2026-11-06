import { describe, it, expect } from 'vitest';
import {
  resolveServiceId,
  buildWaitlistForm,
  resolveWaitlistForm,
  WaitlistConfigError,
} from '../src/lib/waitlist';
import { WAITLIST_SERVICES, DEFAULT_WAITLIST_SERVICE } from '../src/config/waitlist';

describe('resolveServiceId', () => {
  it('falls back to the launch default when unset or blank', () => {
    expect(resolveServiceId(undefined)).toBe(DEFAULT_WAITLIST_SERVICE);
    expect(resolveServiceId('')).toBe(DEFAULT_WAITLIST_SERVICE);
    expect(resolveServiceId('   ')).toBe(DEFAULT_WAITLIST_SERVICE);
  });

  it('accepts each registered service id (trimmed)', () => {
    expect(resolveServiceId('buttondown')).toBe('buttondown');
    expect(resolveServiceId(' kit ')).toBe('kit');
    expect(resolveServiceId('formspree')).toBe('formspree');
  });

  it('throws on an unknown id and names the valid options', () => {
    expect(() => resolveServiceId('mailchimp')).toThrow(WaitlistConfigError);
    expect(() => resolveServiceId('mailchimp')).toThrow(/buttondown, kit, formspree/);
  });
});

describe('buildWaitlistForm', () => {
  it('builds Buttondown with its email field and embed hidden field', () => {
    const spec = buildWaitlistForm('buttondown', { PUBLIC_BUTTONDOWN_USERNAME: 'just-train' });
    expect(spec.action).toBe('https://buttondown.com/api/emails/embed-subscribe/just-train');
    expect(spec.method).toBe('POST');
    expect(spec.emailFieldName).toBe('email');
    expect(spec.hiddenFields).toEqual({ embed: '1' });
  });

  it('builds Kit with its distinct email field name', () => {
    const spec = buildWaitlistForm('kit', { PUBLIC_KIT_FORM_ID: '12345' });
    expect(spec.action).toBe('https://app.kit.com/forms/12345/subscriptions');
    expect(spec.emailFieldName).toBe('email_address');
    expect(spec.hiddenFields).toEqual({});
  });

  it('url-encodes the form id into the endpoint', () => {
    const spec = buildWaitlistForm('buttondown', { PUBLIC_BUTTONDOWN_USERNAME: 'a b/c' });
    expect(spec.action).toBe('https://buttondown.com/api/emails/embed-subscribe/a%20b%2Fc');
  });

  it('throws a helpful error when the id env var is missing', () => {
    expect(() => buildWaitlistForm('buttondown', {})).toThrow(WaitlistConfigError);
    expect(() => buildWaitlistForm('buttondown', {})).toThrow(/PUBLIC_BUTTONDOWN_USERNAME/);
  });

  it('treats a whitespace-only id as missing', () => {
    expect(() => buildWaitlistForm('formspree', { PUBLIC_FORMSPREE_FORM_ID: '  ' })).toThrow(
      WaitlistConfigError,
    );
  });

  it('covers every registered service with an id env key', () => {
    for (const service of Object.values(WAITLIST_SERVICES)) {
      const spec = buildWaitlistForm(service.id, { [service.idEnvKey]: 'xyz' });
      expect(spec.action).toContain('xyz');
      expect(spec.action).not.toContain('{id}');
    }
  });
});

describe('resolveWaitlistForm', () => {
  it('reads the service id and its form id from one env map', () => {
    const spec = resolveWaitlistForm({
      PUBLIC_WAITLIST_SERVICE: 'buttondown',
      PUBLIC_BUTTONDOWN_USERNAME: 'just-train',
    });
    expect(spec.serviceId).toBe('buttondown');
    expect(spec.action).toContain('just-train');
  });

  it('defaults to Buttondown when the service is unset', () => {
    const spec = resolveWaitlistForm({ PUBLIC_BUTTONDOWN_USERNAME: 'jt' });
    expect(spec.serviceId).toBe('buttondown');
  });
});
