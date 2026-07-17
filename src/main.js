import { createClient } from '@supabase/supabase-js';
import './style.css';

const form = document.querySelector('#rsvp-form');
const namesInput = document.querySelector('#names');
const namesError = document.querySelector('#names-error');
const formStatus = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');
const buttonLabel = submitButton.querySelector('.button-label');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function setStatus(message, type = '') {
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` form-status--${type}` : ''}`;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
  buttonLabel.textContent = isLoading ? 'Odesílám…' : 'Ano, dorazím';
}

namesInput.addEventListener('input', () => {
  namesInput.removeAttribute('aria-invalid');
  namesError.textContent = '';
  setStatus('');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

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

    form.reset();
    setStatus(`Děkuji! S ${names} počítám. ✦`, 'success');
  } catch (error) {
    console.error('RSVP submission failed:', error);
    setStatus('To se nepovedlo odeslat. Zkus to prosím ještě jednou.', 'error');
  } finally {
    setLoading(false);
  }
});
