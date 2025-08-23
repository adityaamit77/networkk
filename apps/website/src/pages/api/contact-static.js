// This is a fallback for static deployments
// The actual contact form will use Netlify Functions, Vercel Functions, or similar

export const prerender = false; // This will be a server-side route

// Re-export the contact functionality for static builds
export { POST } from './contact-new.ts';
