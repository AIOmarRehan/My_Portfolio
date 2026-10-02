/**
 * Server-side checks for admin image uploads (upload-image and upload-qr).
 * The file input's accept="image/*" is only a hint to the file picker, so the
 * routes must enforce the type and size themselves.
 */

/** Allowed image MIME types and the extension each one is stored under. */
export const IMAGE_EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/** A readable reason the file can't be uploaded, or null when it's fine. */
export function imageUploadError(file: File): string | null {
  if (!Object.hasOwn(IMAGE_EXTENSION_BY_MIME, file.type)) {
    return `Invalid file type. Allowed: PNG, JPEG, WebP, GIF, AVIF, SVG. Received: ${file.type || 'unknown'}`
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `File too large (max 5MB). Received: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
  }
  return null
}
