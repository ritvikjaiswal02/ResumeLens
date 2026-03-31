/**
 * Shared server-side validation utilities.
 * Import only in API routes (never in client components).
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5 MB
const MAX_JD_CHARS  = 15_000            // generous but bounded
const MAX_NAME_CHARS = 200

/**
 * Validate a PDF File/Blob from formData.
 * Checks MIME type and size BEFORE reading into memory.
 */
export function validatePDFMeta(file) {
  if (!file || typeof file !== 'object') {
    return { ok: false, error: 'No file provided' }
  }
  if (file.type !== 'application/pdf') {
    return { ok: false, error: 'Only PDF files are accepted' }
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: 'File too large. Max size is 5 MB.' }
  }
  return { ok: true }
}

/**
 * Confirm the bytes actually start with the PDF magic number (%PDF).
 * Call AFTER arrayBuffer() so we don't double-read.
 */
export function validatePDFBytes(buffer) {
  const view = new Uint8Array(buffer)
  // %PDF = 0x25 0x50 0x44 0x46
  return (
    view[0] === 0x25 &&
    view[1] === 0x50 &&
    view[2] === 0x44 &&
    view[3] === 0x46
  )
}

/**
 * Sanitise a plain-text string from formData.
 * Returns '' for missing/non-string values (never null).
 */
export function sanitizeString(value, maxLen = MAX_NAME_CHARS) {
  if (!value || typeof value !== 'string') return ''
  return value.trim().slice(0, maxLen)
}

/**
 * Validate + sanitise a job description string.
 * Returns { ok, value, error }.
 */
export function validateJD(raw) {
  if (!raw || typeof raw !== 'string' || raw.trim().length === 0) {
    return { ok: false, error: 'Job description is required' }
  }
  return { ok: true, value: raw.trim().slice(0, MAX_JD_CHARS) }
}

// ── Simple in-process rate limiter ──────────────────────────────────────────
// Not persistent across Lambda cold starts, but catches rapid repeated calls
// within the same invocation window.  Good enough for MVP without Redis.
const _rl = new Map()

/**
 * Check whether userId has exceeded maxRequests within windowMs.
 * Returns { allowed: boolean, retryAfterMs: number }
 */
export function checkRateLimit(userId, { maxRequests = 10, windowMs = 60_000 } = {}) {
  const now = Date.now()
  let rec = _rl.get(userId)

  if (!rec || now > rec.resetAt) {
    rec = { count: 0, resetAt: now + windowMs }
  }

  rec.count++
  _rl.set(userId, rec)

  return {
    allowed: rec.count <= maxRequests,
    retryAfterMs: rec.count > maxRequests ? rec.resetAt - now : 0,
  }
}
