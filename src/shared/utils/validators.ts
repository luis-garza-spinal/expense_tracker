/**
 * Returns true if value is a finite positive number (> 0).
 */
export function isValidAmount(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  return Number.isFinite(value) && value > 0;
}

/**
 * Returns true if value is a non-empty string after trimming.
 */
export function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
