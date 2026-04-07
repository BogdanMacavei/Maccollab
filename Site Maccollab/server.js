require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');
const nodemailer = require('nodemailer');
const rateLimit  = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── DATA FILE (submissions stored locally) ─────────── */
const DATA_FILE = path.join(__dirname, 'data', 'submissions.json');

function ensureDataDir() {
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function readSubmissions() {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveSubmission(entry) {
  ensureDataDir();
  const list = readSubmissions();
  list.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

/* ─── EMAIL TRANSPORTER ──────────────────────────────── */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST  || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(subject, html) {
  if (process.env.SEND_EMAIL !== 'true') {
    console.log('\n📧  [EMAIL MOCK — set SEND_EMAIL=true to really send]');
    console.log('   Subject:', subject);
    return;
  }
  await transporter.sendMail({
    from: `"Maccollab Website" <${process.env.SMTP_USER}>`,
    to:   process.env.EMAIL_TO,
    subject,
    html,
  });
}

/* ─── MIDDLEWARE ─────────────────────────────────────── */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // serve HTML/CSS/JS/images

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Too many requests. Please try again later.' },
});

/* ─── VALIDATION HELPERS ────────────────────────────── */
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function sanitize(str) {
  return String(str || '').trim().slice(0, 1000);
}

/* ══════════════════════════════════════════════════════
   ROUTES
   ══════════════════════════════════════════════════════ */

/* ─── POST /api/contact ─────────────────────────────── */
app.post('/api/contact', apiLimiter, async (req, res) => {
  const { name, email, phone, message } = req.body;

  const n = sanitize(name);
  const e = sanitize(email);
  const p = sanitize(phone);
  const m = sanitize(message);

  if (!n || !e || !m) {
    return res.status(400).json({ ok: false, message: 'Name, email, and message are required.' });
  }
  if (!isValidEmail(e)) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' });
  }

  const entry = {
    type: 'contact',
    name: n, email: e, phone: p, message: m,
    createdAt: new Date().toISOString(),
  };

  saveSubmission(entry);
  console.log(`\n📩  New contact from: ${n} <${e}>`);

  try {
    await sendEmail(
      `New Contact from ${n} – Maccollab`,
      `<h2>New Contact Message</h2>
       <p><strong>Name:</strong> ${n}</p>
       <p><strong>Email:</strong> ${e}</p>
       <p><strong>Phone:</strong> ${p || '—'}</p>
       <hr/>
       <p><strong>Message:</strong></p>
       <p>${m.replace(/\n/g, '<br/>')}</p>
       <hr/>
       <small>Received: ${entry.createdAt}</small>`
    );
  } catch (err) {
    console.error('Email error:', err.message);
  }

  res.json({ ok: true, message: 'Thank you! We will get back to you shortly.' });
});

/* ─── POST /api/book-tour ────────────────────────────── */
app.post('/api/book-tour', apiLimiter, async (req, res) => {
  const { name, email, phone, date, time, officeType, notes } = req.body;

  const n  = sanitize(name);
  const e  = sanitize(email);
  const p  = sanitize(phone);
  const d  = sanitize(date);
  const t  = sanitize(time);
  const ot = sanitize(officeType);
  const no = sanitize(notes);

  if (!n || !e || !d || !t) {
    return res.status(400).json({ ok: false, message: 'Name, email, date, and time are required.' });
  }
  if (!isValidEmail(e)) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' });
  }

  const entry = {
    type: 'tour', name: n, email: e, phone: p,
    date: d, time: t, officeType: ot, notes: no,
    createdAt: new Date().toISOString(),
  };

  saveSubmission(entry);
  console.log(`\n🏢  Tour booking from: ${n} <${e}> on ${d} at ${t}`);

  try {
    await sendEmail(
      `New Tour Booking from ${n} – Maccollab`,
      `<h2>New Tour Booking</h2>
       <p><strong>Name:</strong> ${n}</p>
       <p><strong>Email:</strong> ${e}</p>
       <p><strong>Phone:</strong> ${p || '—'}</p>
       <p><strong>Preferred Date:</strong> ${d}</p>
       <p><strong>Preferred Time:</strong> ${t}</p>
       <p><strong>Office Interest:</strong> ${ot || '—'}</p>
       <p><strong>Notes:</strong> ${no || '—'}</p>
       <hr/>
       <small>Received: ${entry.createdAt}</small>`
    );
  } catch (err) {
    console.error('Email error:', err.message);
  }

  res.json({ ok: true, message: 'Tour booked! We will confirm your visit by email.' });
});

/* ─── POST /api/request-offer ────────────────────────── */
app.post('/api/request-offer', apiLimiter, async (req, res) => {
  const { name, email, phone, officeType, teamSize, message } = req.body;

  const n  = sanitize(name);
  const e  = sanitize(email);
  const p  = sanitize(phone);
  const ot = sanitize(officeType);
  const ts = sanitize(teamSize);
  const m  = sanitize(message);

  if (!n || !e) {
    return res.status(400).json({ ok: false, message: 'Name and email are required.' });
  }
  if (!isValidEmail(e)) {
    return res.status(400).json({ ok: false, message: 'Invalid email address.' });
  }

  const entry = {
    type: 'offer', name: n, email: e, phone: p,
    officeType: ot, teamSize: ts, message: m,
    createdAt: new Date().toISOString(),
  };

  saveSubmission(entry);
  console.log(`\n💼  Offer request from: ${n} <${e}>`);

  try {
    await sendEmail(
      `New Offer Request from ${n} – Maccollab`,
      `<h2>New Offer Request</h2>
       <p><strong>Name:</strong> ${n}</p>
       <p><strong>Email:</strong> ${e}</p>
       <p><strong>Phone:</strong> ${p || '—'}</p>
       <p><strong>Office Type:</strong> ${ot || '—'}</p>
       <p><strong>Team Size:</strong> ${ts || '—'}</p>
       <p><strong>Notes:</strong> ${m || '—'}</p>
       <hr/>
       <small>Received: ${entry.createdAt}</small>`
    );
  } catch (err) {
    console.error('Email error:', err.message);
  }

  res.json({ ok: true, message: 'Thank you! We will prepare a custom offer for you.' });
});

/* ─── GET /api/submissions (simple admin read) ────────── */
app.get('/api/submissions', (req, res) => {
  const list = readSubmissions();
  res.json({ ok: true, count: list.length, data: list });
});

/* ─── Catch-all → serve index.html ───────────────────── */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ─── START ──────────────────────────────────────────── */
ensureDataDir();
app.listen(PORT, () => {
  console.log(`\n✅  Maccollab server running at http://localhost:${PORT}`);
  console.log(`   → Contact form:  POST /api/contact`);
  console.log(`   → Book a tour:   POST /api/book-tour`);
  console.log(`   → Request offer: POST /api/request-offer`);
  console.log(`   → Submissions:   GET  /api/submissions`);
  console.log(`\n   Press Ctrl+C to stop.\n`);
});
