/**
 * Payload focal point -> CSS object-position.
 *
 * Payload stores focalX/focalY as percentages across the image. That is the
 * same coordinate space `object-position: 38% 55%` uses, so this is a format
 * change rather than a conversion. Centre is the fallback, which is also
 * next/image's default, so an image whose focal point was never touched
 * behaves exactly as it does today.
 */
export type Focusable = { focalX?: number | null; focalY?: number | null };

export function objectPositionOf(media: Focusable | null | undefined): string {
  const x = media?.focalX;
  const y = media?.focalY;
  if (typeof x !== 'number' || typeof y !== 'number') return 'center center';
  return `${x}% ${y}%`;
}
