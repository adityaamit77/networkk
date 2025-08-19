import { trackEvent } from '../../lib/analytics';

// This module is loaded in the browser as a module script.
// It reads redirectTo from the form's data attribute to avoid server-side usage of window.

const form = document.getElementById('contact-form');
const successMessage = document.getElementById('form-success');

if (form) {
  const redirectTo = (form.getAttribute('data-redirect-to') || '').trim() || null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      trackEvent('form_submit', { form: 'contact' });
    } catch (err) {
      // analytics failure shouldn't block UX
      console.debug('[analytics] error', err);
    }

    if (redirectTo) {
      window.location.href = redirectTo;
      return;
    }

    if (successMessage) {
      successMessage.classList.remove('hidden');
    }

    // Reset the form
    try {
      (form as HTMLFormElement).reset();
    } catch (err) {
      // ignore
    }
  });
}
