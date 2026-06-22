/* ══════════════════════════════════════════════════════
   MACCOLLAB — MAIN JAVASCRIPT
   ══════════════════════════════════════════════════════ */

emailjs.init('pCeuUl7FpFgAbdqZO');

/* ─── BOOKING CHOICE MODAL ──────────────────────────── */
(function () {
  const modal = document.createElement('div');
  modal.id = 'bookChooseModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal-box book-choose-box">
      <button class="modal-close" id="bookChooseClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Rezervare</p>
      <h2>Ce dorești să rezervi?</h2>
      <div class="book-choose-options">
        <button class="book-choose-card" data-choose="tour">
          <div class="book-choose-icon">🏢</div>
          <div class="book-choose-label">Book a Tour</div>
          <div class="book-choose-sub">Vizitează spațiile noastre</div>
        </button>
        <button class="book-choose-card" data-choose="desk">
          <div class="book-choose-icon">🪑</div>
          <div class="book-choose-label">Book a Desk</div>
          <div class="book-choose-sub">Rezervă un birou dedicat</div>
        </button>
        <button class="book-choose-card" data-choose="conference">
          <div class="book-choose-icon">🎤</div>
          <div class="book-choose-label">Conference Room</div>
          <div class="book-choose-sub">Rezervă sala de conferințe</div>
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  function openChoose()  { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeChoose() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('bookChooseClose').addEventListener('click', closeChoose);
  modal.addEventListener('click', e => { if (e.target === modal) closeChoose(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChoose(); });

  document.querySelectorAll('[data-action="book-choose"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openChoose(); });
  });

  modal.querySelectorAll('.book-choose-card').forEach(card => {
    card.addEventListener('click', function () {
      closeChoose();
      const choice = this.getAttribute('data-choose');
      setTimeout(() => {
        if (choice === 'tour') {
          const tourBtn = document.querySelector('[data-action="book-tour"]');
          if (tourBtn) tourBtn.click();
        } else if (choice === 'desk') {
          const deskBtn = document.querySelector('[data-action="book-desk"]');
          if (deskBtn) deskBtn.click();
          else if (window._openDeskModalMain) window._openDeskModalMain();
        } else if (choice === 'conference') {
          const confBtn = document.querySelector('[data-action="book-conference"]');
          if (confBtn) confBtn.click();
          else if (window._openConfModalMain) window._openConfModalMain();
        }
      }, 300);
    });
  });
})();

/* ─── ATENA BANNER: hide on scroll ─────────────────── */
(function () {
  const banner = document.querySelector('.atena-banner');
  if (!banner) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      banner.classList.add('hidden');
    } else {
      banner.classList.remove('hidden');
    }
  }, { passive: true });
})();

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
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
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
    if (ok) {
      closeModal();
      postToServer('/api/book-tour', body);
    }
  });
})();

/* ══════════════════════════════════════════════════════
   BOOK A DESK MODAL (main page)
   ══════════════════════════════════════════════════════ */
(function () {
  const modal = document.createElement('div');
  modal.id = 'deskModalMain';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="deskModalMainClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Private Desk</p>
      <h2>Book a Desk</h2>
      <p class="modal-sub">Reserve your dedicated desk in our coworking space.</p>
      <form id="deskFormMain" novalidate>
        <div class="form-row">
          <div class="form-group"><input type="text"  name="name"  placeholder="Your Name *" required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone Number *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="date-label">Date *</label>
            <input type="date" name="date" required id="deskMainDate" />
          </div>
          <div class="form-group">
            <label class="date-label">Preferred Time *</label>
            <select name="time" required>
              <option value="">Select time…</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <textarea name="notes" rows="3" placeholder="Details or questions…"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Book Desk</button>
        <p class="form-msg" id="deskMainFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  function openModal()  { document.getElementById('deskMainDate').min = getTodayStr(); document.getElementById('deskMainDate').value = getTodayStr(); modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  window._openDeskModalMain = openModal;

  document.getElementById('deskModalMainClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('[data-action="book-desk"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  document.getElementById('deskFormMain').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgEl = document.getElementById('deskMainFormMsg');
    const body = {
      name:  this.querySelector('[name="name"]').value.trim(),
      email: this.querySelector('[name="email"]').value.trim(),
      phone: this.querySelector('[name="phone"]').value.trim(),
      date:  this.querySelector('[name="date"]').value,
      time:  this.querySelector('[name="time"]').value,
      notes: this.querySelector('[name="notes"]').value.trim(),
    };
    if (!body.name || !body.email || !body.phone || !body.date || !body.time) {
      return showMsg(msgEl, 'Please fill in all required fields.', 'error');
    }
    const subject = `New Desk Booking from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone}<br><strong>Date:</strong> ${body.date}<br><strong>Time:</strong> ${body.time}<br><strong>Notes:</strong> ${body.notes || '—'}`;
    postToServer('/api/book-desk', { ...body, startDate: body.date, endDate: body.date, deskCount: '1' });
    const ok = await submitForm(subject, message, body.email, this, msgEl, 'Desk booked! We will confirm your reservation by email.');
    if (ok) { closeModal(); }
  });
})();

/* ══════════════════════════════════════════════════════
   BOOK CONFERENCE ROOM MODAL (main page)
   ══════════════════════════════════════════════════════ */
(function () {
  const modal = document.createElement('div');
  modal.id = 'confModalMain';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');

  const hours = Array.from({length: 13}, (_, i) => {
    const h = String(i + 7).padStart(2, '0');
    return `<option value="${h}:00">${h}:00</option>`;
  }).join('');

  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="confModalMainClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Conference Room</p>
      <h2>Book Conference Room</h2>
      <p class="modal-sub">Reserve the conference room for your meeting or event.</p>
      <form id="confFormMain" novalidate>
        <div class="form-row">
          <div class="form-group"><input type="text"  name="name"  placeholder="Your Name *"     required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *"  required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel"    name="phone"        placeholder="Phone Number *"         required /></div>
          <div class="form-group"><input type="number" name="participants"  placeholder="No. of Participants *" required min="1" /></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="date-label">Date *</label>
            <input type="date" name="confDate" required id="confMainDate" />
          </div>
          <div class="form-group">
            <label class="date-label">Start Time *</label>
            <select name="confTime" required>
              <option value="">Select time…</option>
              ${hours}
            </select>
          </div>
        </div>
        <div class="form-group">
          <select name="duration" required>
            <option value="">Duration *</option>
            <option value="1 hour">1 hour</option>
            <option value="2 hours">2 hours</option>
            <option value="3 hours">3 hours</option>
            <option value="4 hours">4 hours</option>
            <option value="Full day">Full day</option>
          </select>
        </div>
        <div class="form-group">
          <textarea name="notes" rows="3" placeholder="Questions or special requirements…"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Book Conference Room</button>
        <p class="form-msg" id="confMainFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  function openModal()  { document.getElementById('confMainDate').min = getTodayStr(); document.getElementById('confMainDate').value = getTodayStr(); modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  window._openConfModalMain = openModal;

  document.getElementById('confModalMainClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('[data-action="book-conference"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  document.getElementById('confFormMain').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgEl = document.getElementById('confMainFormMsg');
    const body = {
      name:         this.querySelector('[name="name"]').value.trim(),
      email:        this.querySelector('[name="email"]').value.trim(),
      phone:        this.querySelector('[name="phone"]').value.trim(),
      participants: this.querySelector('[name="participants"]').value,
      confDate:     this.querySelector('[name="confDate"]').value,
      confTime:     this.querySelector('[name="confTime"]').value,
      duration:     this.querySelector('[name="duration"]').value,
      notes:        this.querySelector('[name="notes"]').value.trim(),
    };
    if (!body.name || !body.email || !body.phone || !body.participants || !body.confDate || !body.confTime || !body.duration) {
      return showMsg(msgEl, 'Please fill in all required fields.', 'error');
    }
    const subject = `Conference Room Booking from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone}<br><strong>Participants:</strong> ${body.participants}<br><strong>Date:</strong> ${body.confDate}<br><strong>Time:</strong> ${body.confTime}<br><strong>Duration:</strong> ${body.duration}<br><strong>Notes:</strong> ${body.notes || '—'}`;
    postToServer('/api/book-conference', body);
    const ok = await submitForm(subject, message, body.email, this, msgEl, 'Booking confirmed! We will get back to you by email.');
    if (ok) { closeModal(); }
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
    if (ok) closeModal();
  });
})();

/* ══════════════════════════════════════════════════════
   SHARED HELPERS
   ══════════════════════════════════════════════════════ */
function showMsg(el, text, type) {
  el.textContent = text;
  el.className   = 'form-msg ' + type;
}

function showSuccessPopup(text) {
  let popup = document.getElementById('successPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'successPopup';
    popup.className = 'success-popup-overlay';
    popup.innerHTML = `
      <div class="success-popup-box">
        <div class="success-popup-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
        <p class="success-popup-text"></p>
        <button class="btn btn-primary success-popup-btn">OK</button>
      </div>`;
    document.body.appendChild(popup);
    popup.querySelector('.success-popup-btn').addEventListener('click', closeSuccessPopup);
    popup.addEventListener('click', e => { if (e.target === popup) closeSuccessPopup(); });
  }
  popup.querySelector('.success-popup-text').textContent = text;
  popup.classList.add('open');
  document.body.style.overflow = 'hidden';
  clearTimeout(popup._timer);
  popup._timer = setTimeout(closeSuccessPopup, 4000);
}

function closeSuccessPopup() {
  const popup = document.getElementById('successPopup');
  if (popup) { popup.classList.remove('open'); document.body.style.overflow = ''; }
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbkp4-D2LFR2e8d9sGgA7HJQZA89xFALagbMX7Gd2u1un270tUESZBEc20LDzpjw/exec';
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

async function postToServer(endpoint, data) {
  const type = endpoint.replace('/api/book-', '').replace('/api/', '');
  const payload = { ...data, endpoint: type };

  if (IS_LOCAL) {
    try {
      const res = await fetch('http://localhost:3000' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log('[Maccollab] local server:', json);
    } catch (err) { console.warn('[Maccollab] local server not reachable:', err.message); }
    return;
  }

  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'REPLACE_WITH_APPS_SCRIPT_URL') return;
  try {
    const url = APPS_SCRIPT_URL + '?data=' + encodeURIComponent(JSON.stringify(payload));
    await fetch(url, { method: 'GET', mode: 'no-cors' });
  } catch (err) { console.warn('[Maccollab] Apps Script error:', err.message); }
}

async function submitForm(subject, messageHtml, replyEmail, form, msgEl, successText) {
  const btn = form.querySelector('[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  try {
    await emailjs.send('service_160291d', 'template_dkgb3vs', {
      subject: subject,
      message: messageHtml,
      email:   replyEmail,
    });
    showSuccessPopup(successText);
    form.reset();
    return true;
  } catch (err) {
    console.error('EmailJS error:', err);
    const detail = err && (err.text || err.message || JSON.stringify(err));
    showMsg(msgEl, `Error: ${detail}`, 'error');
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
