export interface EventPayload {
  [key: string]: any;
}

/**
 * Send an analytics event.
 * Falls back to console logging when no analytics provider is loaded.
 */
export function trackEvent(name: string, payload: EventPayload = {}): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, payload);
  } else {
    console.debug('[analytics]', name, payload);
  }
}

/**
 * Track a standard page view.
 */
export function trackPageView(url: string): void {
  trackEvent('page_view', { url });
}
