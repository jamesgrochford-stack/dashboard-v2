// =============================================================
// Persistent dashboard top bar + bottom navigation.
// Drop this on any page with:
//     <script src="topbar.js" defer></script>
// It self-injects HTML + CSS. The topbar shows today's date and a
// Body Battery indicator read from Supabase (the same 'td:garminLog'
// key index.html's Garmin card writes to), and the bottom bar is the
// five-tab site nav (Today/Football/Study/Gym/Nutrition), each tab
// tinted its own colour so the active page is always obvious at a
// glance. Finance is reached via a link from Today instead of a tab.
// =============================================================
(function () {
  'use strict';

  // -------- Supabase config (same project as the rest of the dashboard) --------
  // Prefer Vercel env vars (served via /api/config → window.DASH_*). No
  // hardcoded fallback -- fail safely rather than silently syncing to
  // production when /api/config didn't load (e.g. local static testing).
  const TOPBAR_SUPABASE_URL = (window.DASH_SUPABASE_URL) || '';
  const TOPBAR_SUPABASE_KEY = (window.DASH_SUPABASE_KEY) || '';

  // -------- CSS --------
  const css = `
.topbar {
  position: sticky; top: 0; z-index: 40;
  display: flex; justify-content: space-between; align-items: center;
  gap: 8px;
  padding: max(10px, env(safe-area-inset-top)) 14px 8px;
  background: #0a0a0b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
}
.topbar-date {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 12.5px; font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}
.topbar-battery {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.topbar-battery-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
}
.topbar-battery-dot.good { background: #6BE3A4; box-shadow: 0 0 6px rgba(107, 227, 164, 0.65); }
.topbar-battery-dot.warn { background: #F2C063; box-shadow: 0 0 6px rgba(242, 192, 99, 0.55); }
.topbar-battery-dot.bad  { background: #FF6B6B; box-shadow: 0 0 6px rgba(255, 107, 107, 0.55); }
.topbar-battery-num {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 13px; font-weight: 700;
  color: #FAFAFA;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* Bottom tab bar — Instagram-style, each tab tinted its own colour */
.bottombar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
  display: flex; justify-content: space-around; align-items: stretch;
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
  background: #0a0a0b;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
}
.bottombar-tab {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 3px;
  padding: 6px 2px 4px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.45);
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s, background 0.15s;
}
.tab-today      { --accent: #F2C063; --accent-bg: rgba(242, 192, 99, 0.14); }
.tab-football   { --accent: #6BE3A4; --accent-bg: rgba(107, 227, 164, 0.14); }
.tab-study      { --accent: #7DD3FC; --accent-bg: rgba(125, 211, 252, 0.14); }
.tab-gym        { --accent: #F2A063; --accent-bg: rgba(242, 160, 99, 0.14); }
.tab-nutrition  { --accent: #C8F060; --accent-bg: rgba(200, 240, 96, 0.14); }
.bottombar-tab-icon {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px;
  font-size: 20px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.15s, transform 0.10s;
}
/* Emoji glyphs carry their own fixed colours (CSS color can't retint
   them), so the per-tab accent is expressed as a soft colour halo behind
   the glyph instead — still reads clearly as "this tab is orange/blue/etc." */
.bottombar-tab-icon::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.20;
  z-index: -1;
  transition: opacity 0.15s;
}
.bottombar-tab.active .bottombar-tab-icon { opacity: 1; }
.bottombar-tab.active .bottombar-tab-icon::before { opacity: 0.38; }
.bottombar-tab.active {
  color: #FAFAFA;
  background: var(--accent-bg);
  border-radius: 12px 12px 0 0;
}
.bottombar-tab.active::after {
  content: '';
  position: absolute; left: 50%; bottom: 0;
  transform: translateX(-50%);
  width: 26px; height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--accent);
}
.bottombar-tab:active .bottombar-tab-icon { transform: scale(0.92); }

/* Push page content above the fixed bottom bar */
body.has-bottombar {
  padding-bottom: calc(72px + env(safe-area-inset-bottom)) !important;
}

@media (max-width: 480px) {
  .topbar { padding-left: 10px; padding-right: 10px; gap: 6px; }
  .topbar-date { font-size: 11.5px; }
  .topbar-battery { padding: 5px 8px; gap: 6px; }
  .topbar-battery-num { font-size: 12px; }
  .bottombar-tab-icon { width: 26px; height: 26px; font-size: 18px; }
  .bottombar-tab { font-size: 9px; padding-left: 1px; padding-right: 1px; }
}

/* === Global mobile lockdown ===
   1) Hide the right-side scrollbar on phones (iOS uses overlay scrollbars anyway).
   2) Stop iOS auto-text-size-adjust.
   3) touch-action: pan-y prevents pinch-zoom while still allowing vertical scroll.
   4) overscroll-behavior on every common modal class stops scroll chaining —
      scrolling inside a settings popup won't drag the page behind it.
   5) When body has .topbar-modal-open, the page can't scroll at all (locked).
*/
html, body {
  -webkit-text-size-adjust: 100%;
}
@media (max-width: 768px) {
  html { touch-action: pan-y; }
  ::-webkit-scrollbar { width: 0; height: 0; display: none; }
  html, body { scrollbar-width: none; -ms-overflow-style: none; }
}
.modal-bg, .modal, .po-modal-bg, .po-modal, .wt-overlay, .wt-viewer {
  overscroll-behavior: contain;
}
body.topbar-modal-open {
  overflow: hidden;
  touch-action: none;
}
/* On phones, blow the modals up to full screen and let them be the only
   scrolling element. Way less "is this scrolling the page or the modal?"
   confusion. */
@media (max-width: 480px) {
  .modal-bg, .po-modal-bg {
    padding: 0 !important;
    align-items: stretch !important;
    justify-content: stretch !important;
  }
  .modal, .po-modal {
    width: 100% !important;
    max-width: 100% !important;
    max-height: 100vh !important;
    height: 100vh !important;
    border-radius: 0 !important;
    padding-top: max(20px, env(safe-area-inset-top)) !important;
    padding-bottom: max(28px, env(safe-area-inset-bottom)) !important;
    overflow-y: auto !important;
    overscroll-behavior: contain;
  }
}
`;

  // -------- Icons (inline SVG, currentColor, so each tab can be tinted) --------
  // -------- HTML --------
  const topbarHtml = `
<header class="topbar" id="topbar" role="navigation" aria-label="Status">
  <span class="topbar-date" id="topbarDate">—</span>
  <div class="topbar-battery" id="topbarBattery" title="Body Battery (today)">
    <span class="topbar-battery-dot" id="topbarBatteryDot"></span>
    <span class="topbar-battery-num" id="topbarBatteryNum">—</span>
  </div>
</header>
`;

  const bottombarHtml = `
<nav class="bottombar" id="bottombar" role="navigation" aria-label="Main tabs">
  <a href="index.html" class="bottombar-tab tab-today" data-page="today">
    <span class="bottombar-tab-icon">🏠</span>
    <span>Today</span>
  </a>
  <a href="football.html" class="bottombar-tab tab-football" data-page="football">
    <span class="bottombar-tab-icon">⚽</span>
    <span>Football</span>
  </a>
  <a href="study.html" class="bottombar-tab tab-study" data-page="study">
    <span class="bottombar-tab-icon">📚</span>
    <span>Study</span>
  </a>
  <a href="gym.html" class="bottombar-tab tab-gym" data-page="gym">
    <span class="bottombar-tab-icon">🏋️</span>
    <span>Gym</span>
  </a>
  <a href="nutrition.html" class="bottombar-tab tab-nutrition" data-page="nutrition">
    <span class="bottombar-tab-icon">🥗</span>
    <span>Nutrition</span>
  </a>
</nav>
`;

  // Finance has its own internal 4-tab bottom nav (Net Worth/Subs/Orders/
  // Wishlist/Vinted) plus a hand-rolled copy of this same site nav sitting
  // at the same screen edge — injecting a second one here would overlap it.
  // The topbar (date + Body Battery) is useful there too, so only the
  // bottom bar is suppressed on finance.html.
  function isFinancePage() {
    const p = (window.location.pathname || '').toLowerCase();
    return p.endsWith('/finance.html') || p.endsWith('finance.html');
  }
  // When a page is iframed (e.g. po-water.html, which can still be opened
  // standalone), the embedded copy shouldn't render its own chrome again.
  function isEmbedded() {
    try { return window.self !== window.top; } catch (e) { return true; }
  }
  // The date + Body Battery top bar was removed site-wide -- Body Battery now
  // lives on Today's Garmin card. The bottom nav below is unaffected.
  function shouldShowTopbar() { return false; }
  function shouldShowBottombar() { return !isFinancePage() && !isEmbedded(); }
  function currentPageKey() {
    const p = (window.location.pathname || '').toLowerCase();
    if (p.endsWith('study.html')) return 'study';
    if (p.endsWith('football.html')) return 'football';
    if (p.endsWith('gym.html')) return 'gym';
    if (p.endsWith('nutrition.html')) return 'nutrition';
    return 'today'; // index.html, /, or anything else falls back to today
  }

  function injectStyleAndHTML() {
    if (isEmbedded()) return;
    if (!document.getElementById('topbar-style')) {
      const style = document.createElement('style');
      style.id = 'topbar-style';
      style.textContent = css;
      document.head.appendChild(style);
    }

    if (shouldShowTopbar() && !document.getElementById('topbar')) {
      const topWrap = document.createElement('div');
      topWrap.innerHTML = topbarHtml.trim();
      document.body.insertBefore(topWrap.firstChild, document.body.firstChild);
    }

    if (shouldShowBottombar() && !document.getElementById('bottombar')) {
      const bottomWrap = document.createElement('div');
      bottomWrap.innerHTML = bottombarHtml.trim();
      document.body.appendChild(bottomWrap.firstChild);

      // Highlight the active bottom tab.
      const active = currentPageKey();
      document.querySelectorAll('.bottombar-tab').forEach((t) => {
        t.classList.toggle('active', t.getAttribute('data-page') === active);
      });

      // Reserve room above the fixed bottom bar so page content can scroll
      // past it without being hidden.
      document.body.classList.add('has-bottombar');
    }
  }

  // -------- Date helpers --------
  function calendarDateKey() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function renderDate() {
    const el = document.getElementById('topbarDate');
    if (!el) return;
    el.textContent = new Date().toLocaleDateString('en-IE', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // -------- Body Battery (read-only, from the same key index.html's
  // Garmin card writes: localStorage 'td:garminLog', synced to Supabase
  // under app_state.key = 'todayDashboard') --------
  function renderBattery(value) {
    const dot = document.getElementById('topbarBatteryDot');
    const num = document.getElementById('topbarBatteryNum');
    if (!dot || !num) return;
    dot.classList.remove('good', 'warn', 'bad');
    if (value == null || isNaN(value)) {
      num.textContent = '—';
      return;
    }
    num.textContent = String(value);
    if (value >= 75) dot.classList.add('good');
    else if (value >= 40) dot.classList.add('warn');
    else dot.classList.add('bad');
  }

  function readGarminLogLocal() {
    try { return JSON.parse(localStorage.getItem('td:garminLog')) || {}; } catch (e) { return {}; }
  }

  async function fetchBodyBattery() {
    // Local-first (instant, works even offline / before the network call
    // resolves) — then reconcile with Supabase, which is authoritative
    // when this isn't the device that logged today's Garmin data.
    const localLog = readGarminLogLocal();
    const todayKey = calendarDateKey();
    const localEntry = localLog[todayKey];
    if (localEntry && localEntry.bodyBattery != null) renderBattery(localEntry.bodyBattery);
    else renderBattery(null);

    if (!window.supabase || !TOPBAR_SUPABASE_URL || !TOPBAR_SUPABASE_KEY) {
      console.warn('[topbar] Supabase not configured -- Body Battery sync disabled.');
      return;
    }
    if (TOPBAR_SUPABASE_URL.indexOf('PASTE-') === 0) return;
    try {
      const supa = window.supabase.createClient(TOPBAR_SUPABASE_URL, TOPBAR_SUPABASE_KEY);
      const { data, error } = await supa
        .from('app_state').select('data').eq('key', 'todayDashboard').maybeSingle();
      if (error || !data || !data.data) return;
      const garminLog = data.data['td:garminLog'] || {};
      const entry = garminLog[todayKey];
      renderBattery(entry && entry.bodyBattery != null ? entry.bodyBattery : null);
    } catch (e) { /* offline — local value (if any) already rendered */ }
  }

  // -------- Mobile lockdown helpers --------
  // Belt-and-suspenders zoom prevention — iOS Safari sometimes ignores
  // user-scalable=no, so we also kill the gesture events directly.
  function blockGesture(e) { e.preventDefault(); }
  function lockGestures() {
    document.addEventListener('gesturestart', blockGesture, { passive: false });
    document.addEventListener('gesturechange', blockGesture, { passive: false });
    document.addEventListener('gestureend', blockGesture, { passive: false });
    // Also kill the iOS double-tap-to-zoom on any tap.
    let lastTouch = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouch <= 300) e.preventDefault();
      lastTouch = now;
    }, { passive: false });
  }

  // Watch every known modal-bg / overlay class — when any one of them
  // gets `.show` or `.is-open`, lock the body scroll. When the last
  // one closes, unlock.
  function startModalLock() {
    const MODAL_SELECTORS = [
      '.modal-bg', '.po-modal-bg', '.wt-overlay', '.wt-viewer', '.wt-cam'
    ];
    function anyOpen() {
      for (const sel of MODAL_SELECTORS) {
        const els = document.querySelectorAll(sel);
        for (const el of els) {
          if (el.classList.contains('show') || el.classList.contains('is-open')) {
            return true;
          }
        }
      }
      return false;
    }
    function sync() {
      document.body.classList.toggle('topbar-modal-open', anyOpen());
    }
    const observer = new MutationObserver(sync);
    // Observe class changes anywhere in body — modal toggles are rare so
    // a global subtree observer is cheap.
    observer.observe(document.body, {
      attributes: true, attributeFilter: ['class'], subtree: true
    });
    sync();
  }

  // -------- Boot --------
  function boot() {
    injectStyleAndHTML();   // bottom nav only now; the topbar is disabled above
    lockGestures();
    startModalLock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
