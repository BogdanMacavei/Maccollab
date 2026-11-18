/* ══════════════════════════════════════════════════════
   MACCOLLAB — COMMUNITY CHAT
   Locally the messages come from server.js (/api/chat);
   on the live site from the Apps Script (endpoints
   chat-list / chat-post). APPS_SCRIPT_URL and IS_LOCAL are
   defined in office-detail.js. Swear words are blurred
   with Profanity.segments() from profanity.js.
   ══════════════════════════════════════════════════════ */
(function () {
  const box = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  if (!box || !form) return;

  const ro = LANG === 'ro';
  const TXT = ro ? {
    empty: 'Încă nu sunt mesaje. Fii primul care scrie!',
    loadError: 'Chatul nu poate fi încărcat momentan. Încearcă din nou puțin mai târziu.',
    sending: 'Se trimite…', send: 'Trimite',
    errors: {
      empty: 'Scrie numele și mesajul.',
      links: 'Linkurile nu sunt permise în chat.',
      busy: 'Sunt multe mesaje acum. Încearcă din nou peste câteva minute.',
      wait: 'Poți trimite un mesaj nou peste câteva secunde.',
      failed: 'Mesajul nu a putut fi trimis. Încearcă din nou.',
    },
    hidden: '[cuvânt cenzurat]',
  } : {
    empty: 'No messages yet. Be the first to write!',
    loadError: 'The chat cannot be loaded right now. Please try again a little later.',
    sending: 'Sending…', send: 'Send',
    errors: {
      empty: 'Please enter your name and a message.',
      links: 'Links are not allowed in the chat.',
      busy: 'There are a lot of messages right now. Please try again in a few minutes.',
      wait: 'You can send another message in a few seconds.',
      failed: 'Your message could not be sent. Please try again.',
    },
    hidden: '[censored word]',
  };
  const WAIT_MS = 20 * 1000;
  const status = document.getElementById('chatStatus');

  async function api(endpoint, payload) {
    if (IS_LOCAL) {
      const res = endpoint === 'chat-list'
        ? await fetch('/api/chat')
        : await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      return res.json();
    }
    const url = APPS_SCRIPT_URL + '?data=' + encodeURIComponent(JSON.stringify({ ...payload, endpoint }));
    const res = await fetch(url);
    return res.json();
  }

  /* Build text with swear words blurred, never via innerHTML. */
  function censored(text) {
    const frag = document.createDocumentFragment();
    for (const seg of Profanity.segments(text)) {
      if (!seg.bad) { frag.appendChild(document.createTextNode(seg.text)); continue; }
      const span = document.createElement('span');
      span.className = 'chat-blur';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = seg.text;
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = TXT.hidden;
      frag.appendChild(span);
      frag.appendChild(sr);
    }
    return frag;
  }

  const fmt = new Intl.DateTimeFormat(ro ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  function render(messages) {
    const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 60;
    box.textContent = '';
    if (!messages.length) {
      const p = document.createElement('p');
      p.className = 'chat-empty';
      p.textContent = TXT.empty;
      box.appendChild(p);
      return;
    }
    for (const m of messages) {
      const item = document.createElement('div');
      item.className = 'chat-msg';
      const head = document.createElement('div');
      head.className = 'chat-msg-head';
      const name = document.createElement('strong');
      name.appendChild(censored(m.name));
      const time = document.createElement('time');
      const d = new Date(m.ts);
      if (!isNaN(d)) { time.dateTime = d.toISOString(); time.textContent = fmt.format(d); }
      head.append(name, time);
      const body = document.createElement('p');
      body.appendChild(censored(m.text));
      item.append(head, body);
      box.appendChild(item);
    }
    if (nearBottom || !box.dataset.loaded) box.scrollTop = box.scrollHeight;
    box.dataset.loaded = '1';
  }

  async function load() {
    try {
      const data = await api('chat-list', {});
      if (!data.ok) throw new Error(data.error || 'error');
      render(data.messages || []);
    } catch (err) {
      if (!box.dataset.loaded) box.innerHTML = `<p class="chat-empty">${TXT.loadError}</p>`;
    }
  }

  function showStatus(text, isError) {
    status.textContent = text || '';
    status.classList.toggle('error', !!isError);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const text = form.message.value.trim();
    if (!name || !text) return showStatus(TXT.errors.empty, true);
    if (/(https?:\/\/|www\.)/i.test(text)) return showStatus(TXT.errors.links, true);
    let last = 0;
    try { last = Number(localStorage.getItem('chatLastPost') || 0); } catch (_) {}
    if (Date.now() - last < WAIT_MS) return showStatus(TXT.errors.wait, true);

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = TXT.sending;
    try {
      const data = await api('chat-post', { name, text });
      if (!data.ok) return showStatus(TXT.errors[data.error] || TXT.errors.failed, true);
      try { localStorage.setItem('chatLastPost', String(Date.now())); localStorage.setItem('chatName', name); } catch (_) {}
      form.message.value = '';
      showStatus('');
      box.dataset.loaded = '';
      await load();
    } catch (err) {
      showStatus(TXT.errors.failed, true);
    } finally {
      btn.disabled = false;
      btn.textContent = TXT.send;
    }
  });

  try { const saved = localStorage.getItem('chatName'); if (saved) form.name.value = saved; } catch (_) {}
  load();
  setInterval(() => { if (!document.hidden) load(); }, 30000);
})();
