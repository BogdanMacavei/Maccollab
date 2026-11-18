/* ══════════════════════════════════════════════════════
   MACCOLLAB — EVENTS
   1. An upcoming event whose data-end time has passed is
      moved to "Past events" automatically (newest first).
   2. Past events scroll as a loop: three cards on desktop,
      two on tablets, one on phones, one step to the left
      every few seconds. Hover/focus pauses it; visitors who
      prefer reduced motion only get the arrow buttons.
   ══════════════════════════════════════════════════════ */
(function () {
  const ro = typeof LANG === 'undefined' || LANG === 'ro';
  const upcoming = document.querySelector('.events-list');
  const track = document.getElementById('pastGrid');
  if (!track) return;

  /* ── 1. Move finished events to the past ── */
  function toPastCard(card) {
    const article = document.createElement('article');
    article.className = 'past-card';
    const poster = card.querySelector('.event-poster');
    if (poster) {
      const link = poster.cloneNode(true);
      link.className = 'past-poster';
      article.appendChild(link);
    }
    const body = document.createElement('div');
    body.className = 'past-body';
    const title = card.querySelector('h3');
    if (title) body.appendChild(title.cloneNode(true));
    const items = card.querySelectorAll('.event-meta li');
    const meta = document.createElement('ul');
    meta.className = 'event-meta';
    // keep date and place (first and third line); time and access are no longer relevant
    [items[0], items[2]].forEach(li => { if (li) meta.appendChild(li.cloneNode(true)); });
    body.appendChild(meta);
    const desc = card.querySelector('.event-desc');
    if (desc) { const p = document.createElement('p'); p.textContent = desc.textContent; body.appendChild(p); }
    article.appendChild(body);
    return article;
  }

  if (upcoming) {
    const now = Date.now();
    upcoming.querySelectorAll('.event-card[data-end]').forEach(card => {
      const end = new Date(card.dataset.end).getTime();
      if (isNaN(end) || end > now) return;
      const empty = track.querySelector('.past-empty');
      if (empty) empty.remove();
      track.prepend(toPastCard(card));
      card.remove();
    });
    if (!upcoming.querySelector('.event-card')) {
      const p = document.createElement('p');
      p.className = 'events-empty';
      p.textContent = ro
        ? 'Momentan nu avem evenimente anunțate. Ai o idee? Scrie-ne în chatul comunității!'
        : 'No events announced right now. Have an idea? Write to us in the community chat!';
      upcoming.appendChild(p);
    }
  }

  /* ── 2. Looping carousel ── */
  const carousel = track.closest('.past-carousel');
  if (!carousel) return;
  const prevBtn = carousel.querySelector('.past-prev');
  const nextBtn = carousel.querySelector('.past-next');
  const SPEED = 600;      // ms per slide
  const INTERVAL = 2500;  // ms between slides
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false, timer = null, paused = false;

  const cards = () => Array.from(track.children).filter(el => el.classList.contains('past-card'));
  const step = () => {
    const first = cards()[0];
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return first.getBoundingClientRect().width + gap;
  };
  const visible = () => {
    const first = cards()[0];
    return first ? Math.max(1, Math.round(track.clientWidth / first.getBoundingClientRect().width)) : 1;
  };
  const canLoop = () => cards().length > visible();

  function after(fn) {
    let done = false;
    const finish = () => { if (done) return; done = true; track.removeEventListener('transitionend', finish); fn(); };
    track.addEventListener('transitionend', finish);
    setTimeout(finish, SPEED + 100);   // in case transitionend does not fire
  }

  function next() {
    if (busy || !canLoop()) return;
    busy = true;
    track.style.transition = `transform ${SPEED}ms ease`;
    track.style.transform = `translateX(${-step()}px)`;
    after(() => {
      track.style.transition = 'none';
      track.appendChild(track.firstElementChild);
      track.style.transform = 'translateX(0)';
      busy = false;
    });
  }

  function prev() {
    if (busy || !canLoop()) return;
    busy = true;
    const w = step();
    track.style.transition = 'none';
    track.prepend(track.lastElementChild);
    track.style.transform = `translateX(${-w}px)`;
    void track.offsetWidth;   // apply the jump before animating back
    track.style.transition = `transform ${SPEED}ms ease`;
    track.style.transform = 'translateX(0)';
    after(() => { busy = false; });
  }

  function start() {
    stop();
    if (reduceMotion || paused || !canLoop()) return;
    timer = setInterval(() => { if (!document.hidden) next(); }, INTERVAL);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }

  function refresh() {
    const loop = canLoop();
    carousel.classList.toggle('is-static', !loop);
    start();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });
  carousel.addEventListener('mouseenter', () => { paused = true; stop(); });
  carousel.addEventListener('mouseleave', () => { paused = false; start(); });
  carousel.addEventListener('focusin', () => { paused = true; stop(); });
  carousel.addEventListener('focusout', () => { paused = false; start(); });
  window.addEventListener('resize', () => { track.style.transition = 'none'; track.style.transform = 'translateX(0)'; refresh(); });

  refresh();
})();
