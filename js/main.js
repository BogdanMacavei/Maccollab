/* ══════════════════════════════════════════════════════
   MACCOLLAB — MAIN JAVASCRIPT
   ══════════════════════════════════════════════════════ */

emailjs.init('pCeuUl7FpFgAbdqZO');

/* ─── NAVBAR: scroll state & hamburger ─────────────── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ─── FAQ ACCORDION ─────────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });
})();

/* ─── SCROLL REVEAL ─────────────────────────────────── */
(function () {
  const singleEls = [
    '.about-text', '.about-img-wrap',
    '.facilities-photos',
    '.contact-form-col', '.contact-info-col',
    '.section-header', '.faq-item',
  ];

  const groupEls = [
    '.offices-grid', '.why-grid',
    '.testimonials-grid', '.facilities-grid',
  ];

  document.querySelectorAll(singleEls.join(',')).forEach(el => el.classList.add('reveal'));
  document.querySelectorAll(groupEls.join(',')).forEach(el => el.classList.add('reveal-group'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-group').forEach(el => observer.observe(el));
})();

/* ─── SMOOTH SCROLL ─────────────────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
})();

/* ─── IMAGE FALLBACK ─────────────────────────────────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () { this.style.display = 'none'; });
});

/* ══════════════════════════════════════════════════════
   CONTACT FORM  → POST /api/contact
   ══════════════════════════════════════════════════════ */
(function () {
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const body = {
      name:    form.querySelector('[name="name"]').value.trim(),
      email:   form.querySelector('[name="email"]').value.trim(),
      phone:   form.querySelector('[name="phone"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim(),
    };

    if (!body.name || !body.email || !body.message) {
      return showMsg(formMsg, 'Please fill in all required fields.', 'error');
    }

    const subject = `New Contact from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone || '—'}<br><hr><strong>Message:</strong><br>${body.message.replace(/\n/g, '<br>')}`;
    await submitForm(subject, message, body.email, form, formMsg,
      'Thank you! We will get back to you shortly.'
    );
  });
})();

/* ══════════════════════════════════════════════════════
   BOOK A TOUR MODAL
   ══════════════════════════════════════════════════════ */
(function () {
  // Create modal HTML
  const modal = document.createElement('div');
  modal.id = 'tourModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="tourModalClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Schedule a Visit</p>
      <h2>Book a Tour</h2>
      <p class="modal-sub">Come and see Maccollab in person. Pick a date and time that works for you.</p>
      <form id="tourForm" novalidate>
        <div class="form-row">
          <div class="form-group"><input type="text"  name="name"  placeholder="Your Name *"     required autocomplete="name"  /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *"  required autocomplete="email" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone (optional)" autocomplete="tel" /></div>
          <div class="form-group">
            <select name="officeType">
              <option value="">Interested in… (optional)</option>
              <option value="Private Desk – 6 desks">Private Desk – 6 desks</option>
              <option value="Private Office – 1–2 desks">Private Office – 1–2 desks</option>
              <option value="Small Office – 4–5 desks">Small Office – 4–5 desks</option>
              <option value="Large Office – 9–12 desks">Large Office – 9–12 desks</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <input type="date" name="date" required id="mainTourDate" min="${getTodayStr()}" />
          </div>
          <div class="form-group">
            <select name="time" required>
              <option value="">Preferred Time *</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <textarea name="notes" rows="3" placeholder="Any questions or notes…"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Confirm Booking</button>
        <p class="form-msg" id="tourFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  // Open modal
  function openModal() {
    const dateInput = document.getElementById('mainTourDate');
    dateInput.value = getTodayStr();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('[name="name"]').focus();
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('tourModalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  // Wire all "Book a Tour" buttons
  document.querySelectorAll('[data-action="book-tour"], .btn-book-tour').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Tour form submit
  const tourForm    = document.getElementById('tourForm');
  const tourFormMsg = document.getElementById('tourFormMsg');

  tourForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const body = {
      name:       tourForm.querySelector('[name="name"]').value.trim(),
      email:      tourForm.querySelector('[name="email"]').value.trim(),
      phone:      tourForm.querySelector('[name="phone"]').value.trim(),
      officeType: tourForm.querySelector('[name="officeType"]').value,
      date:       tourForm.querySelector('[name="date"]').value,
      time:       tourForm.querySelector('[name="time"]').value,
      notes:      tourForm.querySelector('[name="notes"]').value.trim(),
    };

    if (!body.name || !body.email || !body.date || !body.time) {
      return showMsg(tourFormMsg, 'Please fill in all required fields.', 'error');
    }

    const subject = `New Tour Booking from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone || '—'}<br><strong>Interested In:</strong> ${body.officeType || '—'}<br><strong>Date:</strong> ${body.date}<br><strong>Time:</strong> ${body.time}<br><strong>Notes:</strong> ${body.notes || '—'}`;
    const ok = await submitForm(subject, message, body.email, tourForm, tourFormMsg,
      'Tour booked! We will confirm your visit by email.'
    );
    if (ok) setTimeout(closeModal, 2800);
  });
})();

/* ══════════════════════════════════════════════════════
   REQUEST AN OFFER MODAL
   ══════════════════════════════════════════════════════ */
(function () {
  const modal = document.createElement('div');
  modal.id = 'offerModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="offerModalClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Custom Pricing</p>
      <h2>Request an Offer</h2>
      <p class="modal-sub">Tell us about your needs and we'll prepare a personalised offer for you.</p>
      <form id="offerForm" novalidate>
        <div class="form-row">
          <div class="form-group"><input type="text"  name="name"  placeholder="Your Name *"    required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone *" required /></div>
          <div class="form-group">
            <select name="officeType">
              <option value="">Office type (optional)</option>
              <option value="Private Desk – 6 desks">Private Desk – 6 desks</option>
              <option value="Private Office – 1–2 desks">Private Office – 1–2 desks</option>
              <option value="Small Office – 4–5 desks">Small Office – 4–5 desks</option>
              <option value="Large Office – 9–12 desks">Large Office – 9–12 desks</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <textarea name="message" rows="3" placeholder="Any specific requirements or questions…"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Send Offer Request</button>
        <p class="form-msg" id="offerFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  function openModal()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('offerModalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('[data-action="request-offer"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  const offerForm    = document.getElementById('offerForm');
  const offerFormMsg = document.getElementById('offerFormMsg');

  offerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const body = {
      name:       offerForm.querySelector('[name="name"]').value.trim(),
      email:      offerForm.querySelector('[name="email"]').value.trim(),
      phone:      offerForm.querySelector('[name="phone"]').value.trim(),
      officeType: offerForm.querySelector('[name="officeType"]').value,
      message:    offerForm.querySelector('[name="message"]').value.trim(),
    };

    if (!body.name || !body.email || !body.phone) {
      return showMsg(offerFormMsg, 'Name, email and phone are required.', 'error');
    }

    const subject = `New Offer Request from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone}<br><strong>Office Type:</strong> ${body.officeType || '—'}<br><strong>Notes:</strong> ${body.message || '—'}`;
    const ok = await submitForm(subject, message, body.email, offerForm, offerFormMsg,
      'Thank you! We will prepare a custom offer for you.'
    );
    if (ok) setTimeout(closeModal, 2800);
  });
})();

/* ══════════════════════════════════════════════════════
   SHARED HELPERS
   ══════════════════════════════════════════════════════ */
function showMsg(el, text, type) {
  el.textContent = text;
  el.className   = 'form-msg ' + type;
}

async function submitForm(subject, messageHtml, replyEmail, form, msgEl, successText) {
  const btn = form.querySelector('[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  try {
    await emailjs.send('service_x66txtc', 'na1fxhw', {
      subject: subject,
      message: messageHtml,
      email:   replyEmail,
    });
    showMsg(msgEl, successText, 'success');
    form.reset();
    return true;
  } catch (err) {
    console.error('EmailJS error:', err);
    showMsg(msgEl, 'Something went wrong. Please try again.', 'error');
    return false;
  } finally {
    btn.disabled    = false;
    btn.textContent = originalText;
  }
}

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}
