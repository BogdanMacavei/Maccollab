/* ══════════════════════════════════════════════════════
   MACCOLLAB — UI TRANSLATIONS
   Pages declare their language in <html lang="ro|en">.
   Strings in the JS files are written in English; on
   Romanian pages t() and translateTree() swap them.
   ══════════════════════════════════════════════════════ */

const LANG = document.documentElement.lang === 'en' ? 'en' : 'ro';

const RO = {
  'Close': 'Închide',
  'Previous photo': 'Poza anterioară',
  'Next photo': 'Poza următoare',

  /* booking choice */
  'Booking': 'Rezervare',
  'What would you like to book?': 'Ce dorești să rezervi?',
  'Book a Tour': 'Programează o vizită',
  'Visit our spaces': 'Vizitează spațiile noastre',
  'Book a Desk': 'Rezervă un loc',
  'Reserve a dedicated desk': 'Rezervă un loc dedicat',
  'Conference Room': 'Sală de conferințe',
  'Book the conference room': 'Rezervă sala de conferințe',

  /* office names (offer badge) */
  'Private Desk': 'Birou dedicat',
  'Private Office': 'Birou privat',
  'Small Office': 'Birou mic',
  'Large Office': 'Birou mare',
  'Private Desk – 6 desks': 'Birou dedicat – 6 locuri',
  'Private Office – 1–2 desks': 'Birou privat – 1–2 locuri',
  'Small Office – 4–5 desks': 'Birou mic – 4–5 locuri',
  'Large Office – 9–14 desks': 'Birou mare – 9–14 locuri',

  /* tour */
  'Schedule a Visit': 'Vizită',
  'Come and see Maccollab in person. Pick a date and time that works for you.': 'Vino să vezi Maccollab în persoană. Alege o zi și o oră care ți se potrivesc.',
  'Your Name *': 'Numele tău *',
  'Email Address *': 'Adresa de email *',
  'Phone (optional)': 'Telefon (opțional)',
  'Interested in… (optional)': 'Ce te interesează… (opțional)',
  'Interested in…': 'Ce te interesează…',
  'Preferred Time *': 'Ora preferată *',
  'Preferred date': 'Data preferată',
  'Any questions or notes…': 'Întrebări sau observații…',
  'Confirm Booking': 'Confirmă programarea',
  '08:00 AM': '08:00', '09:00 AM': '09:00', '10:00 AM': '10:00', '11:00 AM': '11:00', '12:00 PM': '12:00',
  '01:00 PM': '13:00', '02:00 PM': '14:00', '03:00 PM': '15:00', '04:00 PM': '16:00', '05:00 PM': '17:00',

  /* desk */
  'Reserve your dedicated desk in our coworking space.': 'Rezervă-ți locul dedicat în spațiul nostru de coworking.',
  'Book Your Desk': 'Rezervă-ți locul',
  "Reserve your dedicated desk in our coworking space. We'll confirm your booking by email.": 'Rezervă-ți locul dedicat în spațiul nostru de coworking. Îți confirmăm rezervarea pe email.',
  'Phone Number *': 'Număr de telefon *',
  'Phone *': 'Telefon *',
  'Date *': 'Data *',
  'Select time…': 'Alege ora…',
  'Details or questions…': 'Detalii sau întrebări…',
  'Book Desk': 'Rezervă locul',
  'Number of desks *': 'Număr de locuri *',
  '1 desk': '1 loc', '2 desks': '2 locuri', '3 desks': '3 locuri', '4 desks': '4 locuri', '5 desks': '5 locuri',
  '6 desks (all available)': '6 locuri (toate disponibile)',
  'Start Date *': 'Data de început *',
  'End Date *': 'Data de sfârșit *',

  /* conference */
  'Book Conference Room': 'Rezervă sala de conferințe',
  'Book the Conference Room': 'Rezervă sala de conferințe',
  'Reserve the conference room for your meeting or event.': 'Rezervă sala de conferințe pentru întâlnirea sau evenimentul tău.',
  "Reserve the conference room for your meeting or event. We'll confirm by email.": 'Rezervă sala de conferințe pentru întâlnirea sau evenimentul tău. Îți confirmăm pe email.',
  'No. of Participants *': 'Număr de participanți *',
  'Start Time *': 'Ora de început *',
  'Duration *': 'Durata *',
  '1 hour': '1 oră', '2 hours': '2 ore', '3 hours': '3 ore', '4 hours': '4 ore',
  'Full day': 'O zi întreagă', 'Full Day': 'O zi întreagă',
  'Questions or special requirements…': 'Întrebări sau cerințe speciale…',
  'Any questions or requirements…': 'Întrebări sau cerințe…',

  /* offer */
  'Custom Pricing': 'Ofertă personalizată',
  'Request an Offer': 'Cere o ofertă',
  "Tell us about your needs and we'll prepare a personalised offer for you.": 'Spune-ne de ce ai nevoie și îți pregătim o ofertă personalizată.',
  'Office type (optional)': 'Tipul biroului (opțional)',
  'Any specific requirements or questions…': 'Cerințe specifice sau întrebări…',
  'Send Offer Request': 'Trimite cererea de ofertă',

  /* messages */
  'Sending…': 'Se trimite…',
  'Error': 'Eroare',
  'Please fill in all required fields.': 'Te rugăm să completezi toate câmpurile obligatorii.',
  'Name, email and phone are required.': 'Numele, emailul și telefonul sunt obligatorii.',
  'Something went wrong. Please try again.': 'A apărut o eroare. Te rugăm să încerci din nou.',
  'Thank you! We will get back to you shortly.': 'Mulțumim! Revenim către tine în curând.',
  'Tour booked! We will confirm your visit by email.': 'Vizita a fost programată! Îți confirmăm pe email.',
  'Desk booked! We will confirm your reservation by email.': 'Locul a fost rezervat! Îți confirmăm rezervarea pe email.',
  'Booking confirmed! We will get back to you by email.': 'Rezervarea a fost trimisă! Revenim către tine pe email.',
  'Booking received! We will confirm by email.': 'Rezervarea a fost primită! Îți confirmăm pe email.',
  'Thank you! We will prepare a custom offer for you.': 'Mulțumim! Îți pregătim o ofertă personalizată.',
};

function t(text) {
  return LANG === 'ro' && Object.prototype.hasOwnProperty.call(RO, text) ? RO[text] : text;
}

/* Translate visible text, placeholders and aria-labels inside an element built from English templates,
   then give dialogs and form fields accessible names. */
function translateTree(root) {
  if (!root) return;
  if (LANG === 'ro') {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const raw = node.nodeValue;
      const key = raw.trim();
      if (key && RO[key]) node.nodeValue = raw.replace(key, RO[key]);
    }
    root.querySelectorAll('[placeholder], [aria-label]').forEach(el => {
      ['placeholder', 'aria-label'].forEach(attr => {
        const v = el.getAttribute(attr);
        if (v && RO[v]) el.setAttribute(attr, RO[v]);
      });
    });
  }
  fixA11y(root);
}

/* Accessibility: name modal dialogs after their heading and make sure every form field has a label. */
let _a11yId = 0;
function fixA11y(root) {
  if (!root) return;
  const ensureId = (el, prefix) => el.id || (el.id = `${prefix}-${++_a11yId}`);
  const clean = s => (s || '').replace(/[*…]/g, '').replace(/\((optional|opțional)\)/i, '').trim();

  const dialogs = root.matches && root.matches('[aria-modal]') ? [root] : [];
  dialogs.push(...root.querySelectorAll('[aria-modal]'));
  dialogs.forEach(d => {
    if (!d.getAttribute('role')) d.setAttribute('role', 'dialog');
    const heading = d.querySelector('h1, h2, h3');
    if (heading && !d.hasAttribute('aria-labelledby') && !d.hasAttribute('aria-label')) {
      d.setAttribute('aria-labelledby', ensureId(heading, 'dlg-title'));
    }
  });

  root.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea').forEach(el => {
    if (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby') || el.closest('label')) return;
    if (el.id && root.querySelector(`label[for="${el.id}"]`)) return;
    const prev = el.previousElementSibling;
    if (prev && prev.tagName === 'LABEL' && !prev.htmlFor) {
      prev.htmlFor = ensureId(el, 'field');
      return;
    }
    const name = clean(el.getAttribute('placeholder')) ||
      (el.tagName === 'SELECT' && el.options.length ? clean(el.options[0].text) : '') ||
      el.name;
    if (name) el.setAttribute('aria-label', name);
  });
}

document.addEventListener('DOMContentLoaded', () => fixA11y(document.body));
