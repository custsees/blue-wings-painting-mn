/**
 * Every contact link, derived from the one number in Business Info.
 *
 * This exists because the number was previously written out in four places —
 * `business.phone`, `business.phoneHref`, a literal `sms:+16126365194` inside
 * `smsHrefFor`, and again inside both the English and Spanish meta
 * descriptions. Three of those four are invisible from the admin panel, so
 * "let the client edit the phone number" would have silently shipped a site
 * whose call button still dialled the old one.
 *
 * Formatting is the client's to control: whatever she types is what renders.
 * Only the dialable form is computed, and only ever from that one value.
 */

/** "(612) 636-5194" -> "+16126365194". Falls back to the digits it was given. */
export function telOf(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  // Already international, or something we should not mangle.
  return phone.trim().startsWith('+') ? `+${digits}` : digits;
}

export function phoneHrefOf(phone: string): string {
  return `tel:${telOf(phone)}`;
}

export function emailHrefOf(email: string): string {
  return `mailto:${email}`;
}

/**
 * SMS deep link. The client's original site routed every CTA through tel:/sms:,
 * which works on a phone and dead-ends on a laptop. We keep the fast path and
 * pair it with a real form everywhere it appears.
 */
export function smsHrefOf(phone: string, body: string): string {
  return `sms:${telOf(phone)}?&body=${encodeURIComponent(body)}`;
}
