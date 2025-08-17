/**
 * Get the draft token from environment variables.
 */
export function getDraftToken(): string | undefined {
  // Astro exposes public env vars on import.meta.env
  return import.meta.env.PUBLIC_DRAFT_TOKEN as string | undefined;
}

/**
 * Check if preview mode is enabled for a given URL.
 * If no URL is passed, the current window location is used when available.
 */
export function isPreviewMode(url?: URL): boolean {
  try {
    const target = url ?? (typeof window !== 'undefined' ? new URL(window.location.href) : undefined);
    if (!target) return false;
    const token = target.searchParams.get('preview');
    return Boolean(token && token === getDraftToken());
  } catch {
    return false;
  }
}
