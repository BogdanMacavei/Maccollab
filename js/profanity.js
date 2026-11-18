/* ══════════════════════════════════════════════════════
   MACCOLLAB — PROFANITY FILTER (RO + EN)
   Profanity.segments(text) splits a message into pieces and
   flags the swear words, so the chat can blur them.

   How a word is matched:
   1. lower-case, diacritics removed (ă→a, ș→s, ț→t …)
   2. leetspeak undone (0→o, 1→i, 3→e, 4→a, @→a, $→s …)
   3. repeated letters collapsed (fuuuck → fuck)
   4. compared with EXACT words, or with STEMS for families
      that have no innocent words starting the same way
   Letters spelled out one by one ("f u c k", "p.u.l.a")
   are joined and checked as one word.
   ══════════════════════════════════════════════════════ */
const Profanity = (() => {
  const LEET = { '0': 'o', '1': 'i', '!': 'i', '|': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '$': 's', '7': 't', '8': 'b', '+': 't' };

  const fold = s => s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[şș]/g, 's').replace(/[ţț]/g, 't');

  const plain = s => fold(s)
    .replace(/[01!|3457@$8+]/g, c => LEET[c])
    .replace(/[^a-z]/g, '');
  const norm = s => plain(s).replace(/(.)\1+/g, '$1');

  /* Whole words only (inflected forms listed), because their
     beginnings also start innocent words: pulover, futsal, cocktail … */
  const EXACT = [
    // Romanian
    'pula', 'pule', 'pulii', 'pulei', 'pulamea',
    'fut', 'futu', 'futui', 'futut', 'fututi', 'futa', 'fute', 'futi', 'futeti', 'futem', 'futai', 'futaiul', 'futacios',
    'muie', 'muia', 'muii', 'coaie', 'coaiele', 'coaielor',
    'curva', 'curvo', 'curvele', 'curvelor', 'cacat', 'cacatu', 'cacatul', 'kkt', 'kak', 'cacanar',
    'fmm', 'pzd', 'pzdm', 'sugipula', 'sugaciu',
    // English
    'shit', 'shits', 'shity', 'shithead', 'shitface', 'bulshit', 'horseshit',
    'dick', 'dicks', 'dickhead', 'cock', 'cocks', 'cocksucker', 'prick', 'pricks',
    'ashole', 'asholes', 'arsehole', 'wanker', 'wankers', 'pusy', 'pusies',
    'retard', 'retards', 'retarded', 'twat', 'twats', 'bolocks', 'jackas', 'dumbas',
  ];

  /* Prefixes: any word starting with these is a swear word. */
  const STEMS = [
    // Romanian
    'pizd', 'muist', 'tarf', 'bulang', 'labagi', 'poponar', 'curvar', 'futangi', 'futulet', 'pulifric',
    // English
    'fuck', 'fuk', 'motherfuck', 'cunt', 'bitch', 'whore', 'slut', 'bastard', 'nigg', 'fagot', 'wank',
  ];

  const exact = new Set([...EXACT.map(norm), ...EXACT.map(plain)]);
  const stems = STEMS.map(norm);

  function isBad(word) {
    const p = plain(word), n = norm(word);
    if (p.length < 3) return false;
    return exact.has(p) || exact.has(n) || stems.some(s => n.startsWith(s));
  }

  /* Returns [{ text, bad }] covering the whole message, in order. */
  function segments(text) {
    const str = String(text || '');
    const tokens = [];
    const re = /[\p{L}\p{N}@$!|+]+/gu;
    for (let m; (m = re.exec(str));) tokens.push({ start: m.index, end: m.index + m[0].length, word: m[0], bad: false });

    tokens.forEach(t => { t.bad = isBad(t.word); });

    // spelled-out letters: "f u c k", "p.u.l.a", "s-h-i-t"
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].word.length !== 1) continue;
      let j = i;
      while (j + 1 < tokens.length && tokens[j + 1].word.length === 1 && tokens[j + 1].start - tokens[j].end <= 2) j++;
      if (j - i >= 2) {
        const joined = tokens.slice(i, j + 1).map(t => t.word).join('');
        if (isBad(joined)) {
          tokens[i].end = tokens[j].end;
          tokens[i].bad = true;
          tokens.splice(i + 1, j - i);
        }
      }
    }

    const out = [];
    let pos = 0;
    for (const t of tokens) {
      if (!t.bad) continue;
      if (t.start > pos) out.push({ text: str.slice(pos, t.start), bad: false });
      out.push({ text: str.slice(t.start, t.end), bad: true });
      pos = t.end;
    }
    if (pos < str.length) out.push({ text: str.slice(pos), bad: false });
    return out;
  }

  return { segments, isBad, hasProfanity: text => segments(text).some(s => s.bad) };
})();

if (typeof module !== 'undefined') module.exports = Profanity;
