const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');

function updateHeaderSize() {
  if (siteHeader) siteHeader.classList.toggle('is-compact', window.scrollY > 70);
}

updateHeaderSize();
window.addEventListener('scroll', updateHeaderSize, { passive: true });

function closeNav() {
  if (!nav || !toggle) return;
  nav.classList.remove('open');
  document.body.classList.remove('nav-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Menü öffnen');
}

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    document.body.classList.toggle('nav-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

const countUpElements = document.querySelectorAll('[data-count-up]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCountUp(element) {
  const target = Number(element.dataset.countUp);
  if (!Number.isFinite(target)) return;
  let startTime = null;
  const duration = 1350;
  const update = timestamp => {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * easedProgress).toLocaleString('de-DE');
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = target.toLocaleString('de-DE');
  };
  requestAnimationFrame(update);
}

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const countUpObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCountUp(entry.target);
      countUpObserver.unobserve(entry.target);
    });
  }, { threshold: 0.65 });
  countUpElements.forEach(element => countUpObserver.observe(element));
} else {
  countUpElements.forEach(element => {
    const target = Number(element.dataset.countUp);
    if (Number.isFinite(target)) element.textContent = target.toLocaleString('de-DE');
  });
}
document.querySelectorAll('.main-nav a.active').forEach(link => link.setAttribute('aria-current', 'page'));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const headerContact = document.querySelector('.nav-button');
if (headerContact) {
  headerContact.classList.add('contact-open');
  headerContact.setAttribute('href', '#kontaktformular');
  headerContact.setAttribute('aria-haspopup', 'dialog');
  headerContact.setAttribute('aria-controls', 'kontaktformular');
  headerContact.innerHTML = '<svg class="nav-phone-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 6l8 7 8-7"/></svg><span><small>Nachricht oder Anruf</small>Kontakt</span>';
}

document.body.insertAdjacentHTML('beforeend', `
  <div class="contact-modal" id="kontaktformular" role="dialog" aria-modal="true" aria-labelledby="kontakt-title" aria-describedby="kontakt-beschreibung" hidden>
    <div class="contact-modal-backdrop" data-contact-close></div>
    <div class="contact-modal-panel">
      <button class="contact-modal-close" type="button" data-contact-close aria-label="Kontaktfenster schließen">×</button>
      <div class="contact-form-heading"><p class="overline rose">Wir sind persönlich für Sie da</p><h2 id="kontakt-title">Kontakt</h2><p id="kontakt-beschreibung">Schreiben Sie uns Ihre Anfrage oder rufen Sie direkt an. Wir melden uns so bald wie möglich.</p></div>
      <div class="contact-form-layout">
        <form class="contact-form" action="#demo-kontakt" method="post" data-contact-form>
          <p class="required-note"><span aria-hidden="true">*</span> Pflichtfeld</p>
          <label>Name <span aria-hidden="true">*</span><input type="text" name="Name" autocomplete="name" maxlength="120" required></label>
          <label>Kontaktgrund <span aria-hidden="true">*</span><select name="Kontaktgrund" required data-contact-reason><option value="">Bitte auswählen</option><option>Tischreservierung</option><option>Zimmeranfrage</option><option>Feier im Haus</option><option>Catering</option><option>Bewerbung</option><option>Allgemeine Anfrage</option></select></label>
          <label>E-Mail <span aria-hidden="true">*</span><input type="email" name="E-Mail" autocomplete="email" maxlength="190" required></label>
          <label>Telefon<input type="tel" name="Telefon" autocomplete="tel" maxlength="40" inputmode="tel"><small>Hilfreich für Rückfragen und Reservierungen</small></label>
          <fieldset class="contact-reason-fields" data-contact-fields="Tischreservierung" hidden><legend>Angaben zur Tischreservierung</legend><div class="contact-field-grid"><label>Datum <span aria-hidden="true">*</span><span class="picker-control"><input type="text" name="Reservierungsdatum" placeholder="TT.MM.JJJJ" inputmode="numeric" autocomplete="off" maxlength="10" pattern="[0-3][0-9]\\.[01][0-9]\\.[0-9]{4}" data-german-date data-reason-required><button class="picker-button" type="button" data-picker-button aria-label="Datum im Kalender auswählen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 2v4M16 2v4M5 9h14"/></svg></button><input class="native-picker" type="date" lang="de-DE" tabindex="-1" aria-hidden="true" data-native-picker="date"></span><small>Format: TT.MM.JJJJ</small></label><label>Uhrzeit <span aria-hidden="true">*</span><span class="picker-control"><input type="text" name="Reservierungszeit" placeholder="HH:MM" inputmode="numeric" autocomplete="off" maxlength="5" pattern="(?:[01][0-9]|2[0-3]):[0-5][0-9]" data-german-time data-reason-required><button class="picker-button" type="button" data-picker-button aria-label="Uhrzeit auswählen"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></button><input class="native-picker" type="time" lang="de-DE" step="900" tabindex="-1" aria-hidden="true" data-native-picker="time"></span><small>24-Stunden-Format</small></label><label>Personenzahl <span aria-hidden="true">*</span><input type="text" name="Personenzahl" placeholder="z. B. 6 Erwachsene, 2 Kinder" maxlength="80" data-reason-required><small>Freie Angabe möglich</small></label></div></fieldset>
          <fieldset class="contact-reason-fields" data-contact-fields="Catering,Feier im Haus" hidden><legend>Angaben zur Veranstaltung</legend><div class="contact-field-grid"><label>Veranstaltungsdatum <span aria-hidden="true">*</span><span class="picker-control"><input type="text" name="Veranstaltungsdatum" placeholder="TT.MM.JJJJ" inputmode="numeric" autocomplete="off" maxlength="10" pattern="[0-3][0-9]\\.[01][0-9]\\.[0-9]{4}" data-german-date data-reason-required><button class="picker-button" type="button" data-picker-button aria-label="Veranstaltungsdatum im Kalender auswählen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 2v4M16 2v4M5 9h14"/></svg></button><input class="native-picker" type="date" lang="de-DE" tabindex="-1" aria-hidden="true" data-native-picker="date"></span><small>Format: TT.MM.JJJJ</small></label><label>Gästezahl <span aria-hidden="true">*</span><input type="text" name="Gästezahl" placeholder="z. B. ca. 80 Personen" maxlength="80" data-reason-required><small>Freie Angabe möglich</small></label><label data-event-location>Veranstaltungsort <span aria-hidden="true">*</span><input type="text" name="Veranstaltungsort" maxlength="180"></label></div></fieldset>
          <label>Betreff <span aria-hidden="true">*</span><input type="text" name="Betreff" maxlength="180" required data-contact-subject></label>
          <label>Nachricht <span aria-hidden="true">*</span><textarea name="Nachricht" rows="7" maxlength="5000" required></textarea></label>
          <label class="contact-consent"><input type="checkbox" required><span>Ich stimme der Verarbeitung meiner Angaben zur Bearbeitung der Anfrage gemäß <a href="datenschutz.html">Datenschutz</a> zu. *</span></label>
          <button class="button button-dark" type="submit">Demo-Anfrage testen</button>
        </form>
        <aside class="contact-form-details"><p class="overline rose">Direkter Kontakt</p><h3>Landhaus<br>Lindenhöhe</h3><p>Inhaber: Max Mustermann<br>Musterstraße 12<br>00000 Musterstadt</p><a href="tel:+490000000000"><small>Telefon</small>0000 000000</a><a href="mailto:demo@example.com"><small>E-Mail</small>demo@example.com</a></aside>
      </div>
    </div>
  </div>`);

const contactModal = document.getElementById('kontaktformular');
const contactOpeners = document.querySelectorAll('.contact-open');
const contactClosers = contactModal ? contactModal.querySelectorAll('[data-contact-close]') : [];
let contactLastFocus = null;
let contactInertElements = [];
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const contactForm = contactModal ? contactModal.querySelector('[data-contact-form]') : null;
const contactReasonSelect = contactForm ? contactForm.querySelector('[data-contact-reason]') : null;
const contactReasonGroups = contactForm ? contactForm.querySelectorAll('[data-contact-fields]') : [];
const eventLocationField = contactForm ? contactForm.querySelector('[data-event-location]') : null;

function updateContactReasonFields(reason) {
  contactReasonGroups.forEach(group => {
    const reasons = group.dataset.contactFields.split(',').map(value => value.trim());
    const isActive = reasons.includes(reason);
    group.hidden = !isActive;
    group.querySelectorAll('[data-reason-required]').forEach(field => {
      field.required = isActive;
      field.disabled = !isActive;
    });
  });
  if (eventLocationField) {
    const locationInput = eventLocationField.querySelector('input');
    const locationIsActive = reason === 'Catering';
    eventLocationField.hidden = !locationIsActive;
    if (locationInput) {
      locationInput.required = locationIsActive;
      locationInput.disabled = !locationIsActive;
    }
  }
}

function formatGermanDateField(field) {
  const digits = field.value.replace(/\D/g, '').slice(0, 8);
  field.value = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('.');
  field.setCustomValidity('');
  if (field.value.length !== 10) return;
  const [day, month, year] = field.value.split('.').map(Number);
  const enteredDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isRealDate = enteredDate.getFullYear() === year && enteredDate.getMonth() === month - 1 && enteredDate.getDate() === day;
  if (!isRealDate) field.setCustomValidity('Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein.');
  else if (enteredDate < today) field.setCustomValidity('Bitte wählen Sie ein heutiges oder zukünftiges Datum.');
}

function formatGermanTimeField(field) {
  const digits = field.value.replace(/\D/g, '').slice(0, 4);
  field.value = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
  field.setCustomValidity('');
  if (field.value.length === 5 && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(field.value)) {
    field.setCustomValidity('Bitte geben Sie eine gültige Uhrzeit im 24-Stunden-Format HH:MM ein.');
  }
}

if (contactForm) {
  contactForm.querySelectorAll('[data-german-date]').forEach(field => {
    field.addEventListener('input', () => formatGermanDateField(field));
  });
  contactForm.querySelectorAll('[data-german-time]').forEach(field => {
    field.addEventListener('input', () => formatGermanTimeField(field));
  });
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  contactForm.querySelectorAll('.picker-control').forEach(control => {
    const visibleField = control.querySelector('[data-german-date], [data-german-time]');
    const nativePicker = control.querySelector('[data-native-picker]');
    const pickerButton = control.querySelector('[data-picker-button]');
    if (!visibleField || !nativePicker || !pickerButton) return;
    if (nativePicker.dataset.nativePicker === 'date') nativePicker.min = localToday;
    nativePicker.addEventListener('change', () => {
      if (nativePicker.dataset.nativePicker === 'date' && nativePicker.value) {
        const [year, month, day] = nativePicker.value.split('-');
        visibleField.value = `${day}.${month}.${year}`;
      } else {
        visibleField.value = nativePicker.value;
      }
      visibleField.dispatchEvent(new Event('input', { bubbles: true }));
    });
    visibleField.addEventListener('input', () => {
      if (nativePicker.dataset.nativePicker === 'date') {
        const match = visibleField.value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        nativePicker.value = match ? `${match[3]}-${match[2]}-${match[1]}` : '';
      } else {
        nativePicker.value = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(visibleField.value) ? visibleField.value : '';
      }
    });
    pickerButton.addEventListener('click', () => {
      try {
        if (typeof nativePicker.showPicker === 'function') nativePicker.showPicker();
        else { nativePicker.focus(); nativePicker.click(); }
      } catch (_) {
        nativePicker.focus();
      }
    });
  });
  if (contactReasonSelect) {
    contactReasonSelect.addEventListener('change', () => updateContactReasonFields(contactReasonSelect.value));
    updateContactReasonFields(contactReasonSelect.value);
  }
}

function setContactBackgroundInert(isInert) {
  if (!contactModal) return;
  if (isInert) {
    contactInertElements = Array.from(document.body.children).filter(element => element !== contactModal && !element.inert);
    contactInertElements.forEach(element => { element.inert = true; });
  } else {
    contactInertElements.forEach(element => { element.inert = false; });
    contactInertElements = [];
  }
}

function openContactModal(event) {
  if (!contactModal) return;
  if (event) event.preventDefault();
  contactLastFocus = document.activeElement;
  contactModal.hidden = false;
  document.body.classList.add('contact-modal-open');
  setContactBackgroundInert(true);
  closeNav();
  const requestedReason = event && event.currentTarget ? event.currentTarget.dataset.contactReason : '';
  if (requestedReason && contactReasonSelect) {
    contactReasonSelect.value = requestedReason;
    updateContactReasonFields(requestedReason);
  }
  const firstField = contactModal.querySelector('input:not([type="hidden"]):not([tabindex="-1"]), select, textarea, button');
  if (firstField) firstField.focus();
}
function closeContactModal() {
  if (!contactModal) return;
  contactModal.hidden = true;
  document.body.classList.remove('contact-modal-open');
  setContactBackgroundInert(false);
  if (contactLastFocus && typeof contactLastFocus.focus === 'function') contactLastFocus.focus();
}
contactOpeners.forEach(button => {
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'kontaktformular');
  button.addEventListener('click', openContactModal);
});
contactClosers.forEach(button => button.addEventListener('click', closeContactModal));

const requestedContactReason = new URLSearchParams(window.location.search).get('grund');
const allowedContactReasons = ['Tischreservierung', 'Zimmeranfrage', 'Feier im Haus', 'Catering', 'Bewerbung', 'Allgemeine Anfrage'];
if (contactModal && allowedContactReasons.includes(requestedContactReason)) {
  openContactModal({ preventDefault() {}, currentTarget: { dataset: { contactReason: requestedContactReason } } });
}

document.addEventListener('keydown', event => {
  if (!contactModal || contactModal.hidden) return;
  if (event.key === 'Escape') {
    closeContactModal();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusableElements = Array.from(contactModal.querySelectorAll(focusableSelector));
  if (!focusableElements.length) return;
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

function showPortfolioDemoNotice(message) {
  let notice = document.querySelector('[data-portfolio-demo-notice]');
  if (!notice) {
    notice = document.createElement('div');
    notice.className = 'portfolio-demo-notice';
    notice.dataset.portfolioDemoNotice = '';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    document.body.appendChild(notice);
  }
  notice.textContent = message;
  notice.classList.add('visible');
  window.clearTimeout(notice._hideTimer);
  notice._hideTimer = window.setTimeout(() => notice.classList.remove('visible'), 4200);
}

if (contactForm) {
  const submitButton = contactForm.querySelector('[type="submit"]');
  if (submitButton) submitButton.textContent = 'Demo-Anfrage testen';
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    showPortfolioDemoNotice('Demo erfolgreich: Es wurden keine Daten übertragen und keine E-Mail versendet.');
  });
}

document.querySelectorAll('a[href^="#demo-"], a[href^="tel:"], a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    showPortfolioDemoNotice('Portfolio-Demo: Dieser externe Kontakt oder Buchungslink ist bewusst deaktiviert.');
  });
});
