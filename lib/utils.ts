// Utility functions
// Keep utility functions pure and focused on single responsibilities

/**
 * Utility function to merge CSS class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
