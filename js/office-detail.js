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
            <select name="officeType">
              <option value="">Interested in…</option>
              <option value="private">Private Office – 1 desk</option>
              <option value="small">Small Office – 2 desks</option>
              <option value="medium">Medium Office – 4–5 desks</option>
              <option value="large">Large Office – 9–12 desks</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="date" name="date" required min="${new Date().toISOString().split('T')[0]}" /></div>
          <div class="form-group">
            <select name="time" required>
              <option value="">Preferred Time *</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
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

  function openModal()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('tourModalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('[data-action="book-tour"]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
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
    try {
      const res = await fetch('/api/book-tour', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const data = await res.json();
      msgEl.textContent = data.message;
      msgEl.className = 'form-msg ' + (data.ok ? 'success' : 'error');
      if (data.ok) { this.reset(); setTimeout(closeModal, 2500); }
    } catch { msgEl.textContent = 'Network error. Please try again.'; msgEl.className = 'form-msg error'; }
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
        <div class="form-row">
          <div class="form-group"><input type="text"  name="name"  placeholder="Your Name *"    required /></div>
          <div class="form-group"><input type="email" name="email" placeholder="Email Address *" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone (optional)" /></div>
          <div class="form-group">
            <select name="officeType">
              <option value="">Office type (optional)</option>
              <option value="private">Private Office – 1 desk</option>
              <option value="small">Small Office – 2 desks</option>
              <option value="medium">Medium Office – 4–5 desks</option>
              <option value="large">Large Office – 9–12 desks</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <select name="teamSize">
            <option value="">Team size (optional)</option>
            <option value="1">Just me</option>
            <option value="2-3">2–3 people</option>
            <option value="4-6">4–6 people</option>
            <option value="7-10">7–10 people</option>
            <option value="10+">10+ people</option>
          </select>
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
    btn.addEventListener('click', e => { e.preventDefault(); openOfferModal(); });
  });

  document.getElementById('offerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msgEl = document.getElementById('offerFormMsg');
    const body = {
      name:       this.querySelector('[name="name"]').value.trim(),
      email:      this.querySelector('[name="email"]').value.trim(),
      phone:      this.querySelector('[name="phone"]').value.trim(),
      officeType: this.querySelector('[name="officeType"]').value,
      teamSize:   this.querySelector('[name="teamSize"]').value,
      message:    this.querySelector('[name="message"]').value.trim(),
    };
    if (!body.name || !body.email) {
      msgEl.textContent = 'Name and email are required.';
      msgEl.className = 'form-msg error';
      return;
    }
    const btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res  = await fetch('/api/request-offer', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const data = await res.json();
      msgEl.textContent = data.message;
      msgEl.className = 'form-msg ' + (data.ok ? 'success' : 'error');
      if (data.ok) { this.reset(); setTimeout(closeOfferModal, 2500); }
    } catch { msgEl.textContent = 'Network error. Please try again.'; msgEl.className = 'form-msg error'; }
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
          <div class="form-group"><input type="tel" name="phone" placeholder="Phone (optional)" /></div>
          <div class="form-group">
            <select name="startDate">
              <option value="">Start date (optional)</option>
              <option value="asap">As soon as possible</option>
              <option value="1week">Within 1 week</option>
              <option value="2weeks">Within 2 weeks</option>
              <option value="1month">Within 1 month</option>
            </select>
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

  function openDeskModal()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; }
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
      teamSize:  '1',
      message:   `Start: ${this.querySelector('[name="startDate"]').value}. ${this.querySelector('[name="message"]').value.trim()}`,
    };
    if (!body.name || !body.email) {
      msgEl.textContent = 'Name and email are required.';
      msgEl.className = 'form-msg error';
      return;
    }
    const btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res  = await fetch('/api/request-offer', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const data = await res.json();
      msgEl.textContent = data.ok ? 'Desk booked! We will confirm your reservation by email.' : data.message;
      msgEl.className = 'form-msg ' + (data.ok ? 'success' : 'error');
      if (data.ok) { this.reset(); setTimeout(closeDeskModal, 2500); }
    } catch { msgEl.textContent = 'Network error. Please try again.'; msgEl.className = 'form-msg error'; }
    finally { btn.disabled = false; btn.textContent = 'Book Desk'; }
  });
})();
