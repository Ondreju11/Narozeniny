import { createClient } from '@supabase/supabase-js';
import './style.css';

const countdown = document.querySelector('#countdown');
const form = document.querySelector('#rsvp-form');
const namesInput = document.querySelector('#names');
const namesError = document.querySelector('#names-error');
const formStatus = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');
const buttonLabel = submitButton.querySelector('.button-label');
const submissionStorageKey = 'narozeniny-rsvp-2026';
let hasSubmitted = false;

try {
  hasSubmitted = window.localStorage.getItem(submissionStorageKey) === 'submitted';
} catch {
  // The form still works when browser storage is unavailable.
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey);
const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

const partyStartsAt = new Date('2026-08-01T14:00:00+02:00').getTime();

function czechDays(value) {
  if (value === 1) return 'den';
  if (value >= 2 && value <= 4) return 'dny';
  return 'dní';
}

function updateCountdown() {
  const remaining = partyStartsAt - Date.now();

  if (remaining <= 0) {
    countdown.textContent = 'Dnes slavíme';
    return false;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.textContent = `${days} ${czechDays(days)} · ${String(hours).padStart(2, '0')} h · ${String(minutes).padStart(2, '0')} min · ${String(seconds).padStart(2, '0')} s`;
  return true;
}

if (updateCountdown()) {
  const countdownTimer = window.setInterval(() => {
    if (!updateCountdown()) window.clearInterval(countdownTimer);
  }, 1000);
}

function setStatus(message, type = '') {
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` form-status--${type}` : ''}`;
}

function setLoading(isLoading) {
  if (hasSubmitted) {
    submitButton.disabled = true;
    submitButton.classList.remove('is-loading');
    buttonLabel.textContent = 'Účast potvrzena';
    return;
  }

  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
  buttonLabel.textContent = isLoading ? 'Odesílám…' : 'Ano, dorazím';
}

function lockRsvpForm(message = 'Účast už je potvrzená. Děkuji!') {
  hasSubmitted = true;
  namesInput.disabled = true;
  form.classList.add('is-submitted');
  setLoading(false);
  setStatus(message, 'success');
}

if (hasSubmitted) lockRsvpForm();

namesInput.addEventListener('input', () => {
  namesInput.removeAttribute('aria-invalid');
  namesError.textContent = '';
  setStatus('');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (hasSubmitted) return;

  const names = namesInput.value.trim().replace(/\s+/g, ' ');
  const website = form.elements.website.value;

  if (website) return;

  if (names.length < 2) {
    namesInput.setAttribute('aria-invalid', 'true');
    namesError.textContent = 'Napiš prosím alespoň jedno jméno.';
    namesInput.focus();
    return;
  }

  if (!hasSupabaseConfig) {
    setStatus('Formulář zatím není propojený se Supabase.', 'error');
    return;
  }

  setLoading(true);
  setStatus('');

  try {
    const { error } = await supabase.from('rsvps').insert({ names });
    if (error) throw error;

    try {
      window.localStorage.setItem(submissionStorageKey, 'submitted');
    } catch {
      // Keep the form locked for the current page even without storage.
    }

    form.reset();
    lockRsvpForm(`Děkuji! S ${names} počítám. ✦`);
  } catch (error) {
    console.error('RSVP submission failed:', error);
    setStatus('To se nepovedlo odeslat. Zkus to prosím ještě jednou.', 'error');
  } finally {
    setLoading(false);
  }
});
