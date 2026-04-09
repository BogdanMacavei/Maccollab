emailjs.init('pCeuUl7FpFgAbdqZO');

/* ── Gallery photo switcher ── */
function setMain(thumb) {
  document.getElementById('mainPhoto').src = thumb.src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

/* ── Navbar scroll (always scrolled on detail pages) ── */
document.getElementById('navbar').classList.add('scrolled');

/* ── Hamburger menu ── */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger) return;
  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

/* ── Book a Tour modal (re-use from main.js logic inline) ── */
(function () {
  const modal = document.createElement('div');
  modal.id = 'tourModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="tourModalClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Schedule a Visit</p>
      <h2>Book a Tour</h2>
      <p class="modal-sub">Come and see maccollab in person. Pick a date and time.</p>
      <form id="tourForm" novalidate>
        <div class="form-row">
          <div class="form-group"><input type="text" name="name" placeholder="Your Name *" required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone (optional)" /></div>
          <div class="form-group">
            <select name="officeType" id="tourOfficeTypeSelect">
              <option value="">Interested in…</option>
              <option value="Private Desk – 6 desks">Private Desk – 6 desks</option>
              <option value="Private Office – 1–2 desks">Private Office – 1–2 desks</option>
              <option value="Small Office – 4–5 desks">Small Office – 4–5 desks</option>
              <option value="Large Office – 9–12 desks">Large Office – 9–12 desks</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="date" name="date" required id="tourDateInput" /></div>
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
        <div class="form-group"><textarea name="notes" rows="3" placeholder="Any questions or notes…"></textarea></div>
        <button type="submit" class="btn btn-primary btn-full">Confirm Booking</button>
        <p class="form-msg" id="tourFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const tourDateInput = document.getElementById('tourDateInput');
  const tourOfficeTypeSelect = document.getElementById('tourOfficeTypeSelect');

  function openModal(preselect) {
    tourDateInput.min   = new Date().toISOString().split('T')[0];
    tourDateInput.value = new Date().toISOString().split('T')[0];
    if (preselect) tourOfficeTypeSelect.value = preselect;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('tourModalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('[data-action="book-tour"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal(btn.getAttribute('data-tour-type') || '');
    });
  });

  document.getElementById('tourForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgEl = document.getElementById('tourFormMsg');
    const body = {
      name:  this.querySelector('[name="name"]').value.trim(),
      email: this.querySelector('[name="email"]').value.trim(),
      date:  this.querySelector('[name="date"]').value,
      time:  this.querySelector('[name="time"]').value,
      phone: this.querySelector('[name="phone"]').value.trim(),
      officeType: this.querySelector('[name="officeType"]').value,
      notes: this.querySelector('[name="notes"]').value.trim(),
    };
    if (!body.name || !body.email || !body.date || !body.time) {
      msgEl.textContent = 'Please fill in all required fields.';
      msgEl.className = 'form-msg error';
      return;
    }
    const btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    const subject = `New Tour Booking from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone || '—'}<br><strong>Interested In:</strong> ${body.officeType || '—'}<br><strong>Date:</strong> ${body.date}<br><strong>Time:</strong> ${body.time}<br><strong>Notes:</strong> ${body.notes || '—'}`;
    try {
      await emailjs.send('service_x66txtc', 'na1fxhw', { subject, message, email: body.email });
      msgEl.textContent = 'Tour booked! We will confirm your visit by email.';
      msgEl.className = 'form-msg success';
      this.reset(); setTimeout(closeModal, 2500);
    } catch (err) { console.error(err); msgEl.textContent = 'Something went wrong. Please try again.'; msgEl.className = 'form-msg error'; }
    finally { btn.disabled = false; btn.textContent = 'Confirm Booking'; }
  });
})();

/* ══════════════════════════════════════════════════════
   REQUEST AN OFFER MODAL (office detail pages)
   ══════════════════════════════════════════════════════ */
(function () {
  const modal = document.createElement('div');
  modal.id = 'offerModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
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
        <div class="offer-office-type-display" id="offerOfficeTypeDisplay"></div>
        <input type="hidden" name="officeType" id="offerOfficeTypeInput" />
        <div class="form-row">
          <div class="form-group"><input type="text"  name="name"  placeholder="Your Name *"    required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone *" required /></div>
        </div>
        <div class="form-group">
          <textarea name="message" rows="3" placeholder="Any specific requirements or questions…"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Send Offer Request</button>
        <p class="form-msg" id="offerFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  function openOfferModal()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function closeOfferModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('offerModalClose').addEventListener('click', closeOfferModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeOfferModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOfferModal(); });

  document.querySelectorAll('[data-action="request-offer"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const officeType = btn.getAttribute('data-office-type') || '';
      document.getElementById('offerOfficeTypeInput').value = officeType;
      const display = document.getElementById('offerOfficeTypeDisplay');
      if (officeType) {
        display.innerHTML = `<span class="offer-office-badge">${officeType}</span>`;
        display.style.display = 'block';
      } else {
        display.style.display = 'none';
      }
      openOfferModal();
    });
  });

  document.getElementById('offerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgEl = document.getElementById('offerFormMsg');
    const body = {
      name:       this.querySelector('[name="name"]').value.trim(),
      email:      this.querySelector('[name="email"]').value.trim(),
      phone:      this.querySelector('[name="phone"]').value.trim(),
      officeType: this.querySelector('[name="officeType"]').value,
      message:    this.querySelector('[name="message"]').value.trim(),
    };
    if (!body.name || !body.email || !body.phone) {
      msgEl.textContent = 'Name, email and phone are required.';
      msgEl.className = 'form-msg error';
      return;
    }
    const btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    const subject = `New Offer Request from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone}<br><strong>Office Type:</strong> ${body.officeType || '—'}<br><strong>Notes:</strong> ${body.message || '—'}`;
    try {
      await emailjs.send('service_x66txtc', 'na1fxhw', { subject, message, email: body.email });
      msgEl.textContent = 'Thank you! We will prepare a custom offer for you.';
      msgEl.className = 'form-msg success';
      this.reset(); setTimeout(closeOfferModal, 2500);
    } catch (err) { console.error(err); msgEl.textContent = 'Something went wrong. Please try again.'; msgEl.className = 'form-msg error'; }
    finally { btn.disabled = false; btn.textContent = 'Send Offer Request'; }
  });
})();

/* ── Book Desk modal ── */
(function () {
  const modal = document.createElement('div');
  modal.id = 'deskModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="deskModalClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Private Desk</p>
      <h2>Book Your Desk</h2>
      <p class="modal-sub">Reserve your dedicated desk in our coworking space. We'll confirm your booking by email.</p>
      <form id="deskForm" novalidate>
        <div class="form-row">
          <div class="form-group"><input type="text" name="name" placeholder="Your Name *" required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone *" required /></div>
          <div class="form-group">
            <select name="deskCount" required>
              <option value="">Number of desks *</option>
              <option value="1">1 desk</option>
              <option value="2">2 desks</option>
              <option value="3">3 desks</option>
              <option value="4">4 desks</option>
              <option value="5">5 desks</option>
              <option value="6">6 desks (all available)</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="date-label">Start Date *</label>
            <input type="date" name="startDate" required id="deskStartDate" />
          </div>
          <div class="form-group">
            <label class="date-label">End Date *</label>
            <input type="date" name="endDate" required id="deskEndDate" />
          </div>
        </div>
        <div class="form-group">
          <textarea name="message" rows="3" placeholder="Any questions or notes…"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Book Desk</button>
        <p class="form-msg" id="deskFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const startDateInput = document.getElementById('deskStartDate');
  const endDateInput   = document.getElementById('deskEndDate');

  function getTodayStr() { return new Date().toISOString().split('T')[0]; }
  function getTomorrowStr() {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  startDateInput.addEventListener('change', function () {
    endDateInput.min = this.value;
    if (endDateInput.value && endDateInput.value <= this.value) {
      const next = new Date(this.value); next.setDate(next.getDate() + 1);
      endDateInput.value = next.toISOString().split('T')[0];
    }
  });

  function openDeskModal() {
    const today    = getTodayStr();
    const tomorrow = getTomorrowStr();
    startDateInput.min   = today;
    startDateInput.value = today;
    endDateInput.min     = today;
    endDateInput.value   = tomorrow;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDeskModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('deskModalClose').addEventListener('click', closeDeskModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeDeskModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDeskModal(); });

  document.querySelectorAll('[data-action="book-desk"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openDeskModal(); });
  });

  document.getElementById('deskForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgEl = document.getElementById('deskFormMsg');
    const body = {
      name:      this.querySelector('[name="name"]').value.trim(),
      email:     this.querySelector('[name="email"]').value.trim(),
      phone:     this.querySelector('[name="phone"]').value.trim(),
      officeType: 'Private Desk',
      teamSize:   this.querySelector('[name="deskCount"]').value,
      message:   `Desks: ${this.querySelector('[name="deskCount"]').value} | Start: ${this.querySelector('[name="startDate"]').value} | End: ${this.querySelector('[name="endDate"]').value}. ${this.querySelector('[name="message"]').value.trim()}`,
    };
    if (!body.name || !body.email || !body.phone || !body.teamSize || !this.querySelector('[name="startDate"]').value || !this.querySelector('[name="endDate"]').value) {
      msgEl.textContent = 'Please fill in all required fields.';
      msgEl.className = 'form-msg error';
      return;
    }
    const btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    const subject = `New Desk Booking from ${body.name} – Maccollab`;
    const deskStart = this.querySelector('[name="startDate"]').value;
    const deskEnd   = this.querySelector('[name="endDate"]').value;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone}<br><strong>Desks:</strong> ${this.querySelector('[name="deskCount"]').value}<br><strong>Start Date:</strong> ${deskStart}<br><strong>End Date:</strong> ${deskEnd}<br><strong>Notes:</strong> ${this.querySelector('[name="message"]').value.trim() || '—'}`;
    try {
      await emailjs.send('service_x66txtc', 'na1fxhw', { subject, message, email: body.email });
      msgEl.textContent = 'Desk booked! We will confirm your reservation by email.';
      msgEl.className = 'form-msg success';
      this.reset(); setTimeout(closeDeskModal, 2500);
    } catch (err) { console.error(err); msgEl.textContent = 'Something went wrong. Please try again.'; msgEl.className = 'form-msg error'; }
    finally { btn.disabled = false; btn.textContent = 'Book Desk'; }
  });
})();

/* ── Book Conference Room modal ── */
(function () {
  const modal = document.createElement('div');
  modal.id = 'conferenceModal';
  modal.className = 'modal-overlay';
  modal.setAttribute('aria-modal', 'true');

  const hours = Array.from({length: 24}, (_, i) => {
    const h = String(i).padStart(2, '0');
    return `<option value="${h}:00">${h}:00</option>`;
  }).join('');

  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="confModalClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <p class="section-label">Conference Room</p>
      <h2>Book the Conference Room</h2>
      <p class="modal-sub">Reserve the conference room for your meeting or event. We'll confirm by email.</p>
      <form id="confForm" novalidate>
        <div class="form-row">
          <div class="form-group"><input type="text" name="name" placeholder="Your Name *" required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="date-label">Date *</label>
            <input type="date" name="confDate" required id="confDate" />
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
            <option value="Full day">Full Day</option>
          </select>
        </div>
        <div class="form-group">
          <textarea name="notes" rows="3" placeholder="Any questions or requirements…"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Book Conference Room</button>
        <p class="form-msg" id="confFormMsg"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const confDateInput = document.getElementById('confDate');

  function openConfModal() {
    confDateInput.min   = new Date().toISOString().split('T')[0];
    confDateInput.value = new Date().toISOString().split('T')[0];
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeConfModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('confModalClose').addEventListener('click', closeConfModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeConfModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeConfModal(); });

  document.querySelectorAll('[data-action="book-conference"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openConfModal(); });
  });

  document.getElementById('confForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgEl = document.getElementById('confFormMsg');
    const body = {
      name:       this.querySelector('[name="name"]').value.trim(),
      email:      this.querySelector('[name="email"]').value.trim(),
      phone:      this.querySelector('[name="phone"]').value.trim(),
      officeType: 'Conference Room',
      teamSize:   '',
      message:    `Date: ${this.querySelector('[name="confDate"]').value} | Start: ${this.querySelector('[name="confTime"]').value} | Duration: ${this.querySelector('[name="duration"]').value}. ${this.querySelector('[name="notes"]').value.trim()}`,
    };
    if (!body.name || !body.email || !body.phone || !this.querySelector('[name="confDate"]').value || !this.querySelector('[name="confTime"]').value || !this.querySelector('[name="duration"]').value) {
      msgEl.textContent = 'Please fill in all required fields.';
      msgEl.className = 'form-msg error';
      return;
    }
    const btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    const subject = `Conference Room Booking from ${body.name} – Maccollab`;
    const message = `<strong>Name:</strong> ${body.name}<br><strong>Email:</strong> ${body.email}<br><strong>Phone:</strong> ${body.phone}<br><strong>Date:</strong> ${this.querySelector('[name="confDate"]').value}<br><strong>Start Time:</strong> ${this.querySelector('[name="confTime"]').value}<br><strong>Duration:</strong> ${this.querySelector('[name="duration"]').value}<br><strong>Notes:</strong> ${this.querySelector('[name="notes"]').value.trim() || '—'}`;
    try {
      await emailjs.send('service_x66txtc', 'na1fxhw', { subject, message, email: body.email });
      msgEl.textContent = 'Booking received! We will confirm by email.';
      msgEl.className = 'form-msg success';
      this.reset(); setTimeout(closeConfModal, 2500);
    } catch (err) { console.error(err); msgEl.textContent = 'Something went wrong. Please try again.'; msgEl.className = 'form-msg error'; }
    finally { btn.disabled = false; btn.textContent = 'Book Conference Room'; }
  });
})();
