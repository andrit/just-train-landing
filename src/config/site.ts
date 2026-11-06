// Site-wide constants. The only links that leave this page live here.

export const SITE = {
  name: 'Just Train',
  url: 'https://just-train.fit',
  appUrl: 'https://app.just-train.fit',
  /** The one link into the product (Decision: no auth on this site). */
  get registerUrl() {
    return `${this.appUrl}/register`;
  },
  // D5: the app already hosts privacy/terms — point at its canonical copies rather than duplicate.
  // ponytail: hard-coded to the app domain. ceiling: if legal pages ever move on-site. upgrade: add local /privacy, /terms pages.
  get privacyUrl() {
    return `${this.appUrl}/privacy`;
  },
  get termsUrl() {
    return `${this.appUrl}/terms`;
  },
  contactEmail: 'hello@just-train.fit',
  tagline: 'An athlete-first training app. Capture, compare, communicate.',
} as const;
