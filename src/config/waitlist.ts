// Waitlist service registry — the single place that knows how each ESP's embed form is shaped.
// Decision D2: Buttondown is active for launch; Kit and Formspree stay registered so a swap is one
// config value (PUBLIC_WAITLIST_SERVICE) plus that service's form id. Nothing else in the app
// knows which provider is live — components consume the *resolved* spec from src/lib/waitlist.ts.

export const WAITLIST_SERVICE_IDS = ['buttondown', 'kit', 'formspree'] as const;
export type WaitlistServiceId = (typeof WAITLIST_SERVICE_IDS)[number];

/** A provider's embed-form shape, with `{id}` standing in for the per-account form target. */
export interface WaitlistService {
  readonly id: WaitlistServiceId;
  readonly label: string;
  /** Endpoint template; `{id}` is replaced by the account/form id from env. */
  readonly actionTemplate: string;
  /** Which env var supplies the id for `{id}`. */
  readonly idEnvKey: string;
  /** The `name` attribute the email input must carry for this provider. */
  readonly emailFieldName: string;
  /** Hidden fields the provider expects on the POST (e.g. Buttondown's `embed=1`). */
  readonly hiddenFields: Readonly<Record<string, string>>;
}

export const WAITLIST_SERVICES: Readonly<Record<WaitlistServiceId, WaitlistService>> = {
  buttondown: {
    id: 'buttondown',
    label: 'Buttondown',
    actionTemplate: 'https://buttondown.com/api/emails/embed-subscribe/{id}',
    idEnvKey: 'PUBLIC_BUTTONDOWN_USERNAME',
    emailFieldName: 'email',
    hiddenFields: { embed: '1' },
  },
  kit: {
    id: 'kit',
    label: 'Kit (ConvertKit)',
    actionTemplate: 'https://app.kit.com/forms/{id}/subscriptions',
    idEnvKey: 'PUBLIC_KIT_FORM_ID',
    emailFieldName: 'email_address',
    hiddenFields: {},
  },
  formspree: {
    id: 'formspree',
    label: 'Formspree',
    actionTemplate: 'https://formspree.io/f/{id}',
    idEnvKey: 'PUBLIC_FORMSPREE_FORM_ID',
    emailFieldName: 'email',
    hiddenFields: {},
  },
};

/** The active service for launch (Decision D2). Overridable by PUBLIC_WAITLIST_SERVICE. */
export const DEFAULT_WAITLIST_SERVICE: WaitlistServiceId = 'buttondown';
