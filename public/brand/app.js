/* ============================================================
   PAPERCLIP DESIGN SYSTEM — app.js
   Shared interactivity: theme, version, TOC active-link, copy,
   tweaks panel, and helpers consumed by section partials.
   ============================================================ */

(() => {
  const root = document.documentElement;
  const STORAGE = {
    theme: 'pds-theme',
    density: 'pds-density',
    annotations: 'pds-annotations',
    displayFont: 'pds-font-display',
    bodyFont: 'pds-font-body',
    accent: 'pds-accent',
  };

  /* ---------- THEME ---------- */
  function setTheme(theme, persist = true) {
    root.setAttribute('data-theme', theme);
    if (persist) localStorage.setItem(STORAGE.theme, theme);
    document.querySelectorAll('[data-tweak="theme"] button').forEach(b => {
      b.classList.toggle('active', b.dataset.value === theme);
    });
  }
  const savedTheme = localStorage.getItem(STORAGE.theme);
  if (savedTheme) setTheme(savedTheme, false);
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  /* ---------- DENSITY ---------- */
  function setDensity(d) {
    root.setAttribute('data-density', d);
    localStorage.setItem(STORAGE.density, d);
    document.querySelectorAll('[data-tweak="density"] button').forEach(b => {
      b.classList.toggle('active', b.dataset.value === d);
    });
  }
  const savedDensity = localStorage.getItem(STORAGE.density);
  if (savedDensity) setDensity(savedDensity);

  /* ---------- ANNOTATIONS ---------- */
  function setAnnotations(state) {
    root.setAttribute('data-annotations', state);
    localStorage.setItem(STORAGE.annotations, state);
    document.querySelectorAll('[data-tweak="annotations"] button').forEach(b => {
      b.classList.toggle('active', b.dataset.value === state);
    });
  }
  const savedAnno = localStorage.getItem(STORAGE.annotations);
  if (savedAnno) setAnnotations(savedAnno);
  else setAnnotations('on');

  /* ---------- DISPLAY / BODY FONT ---------- */
  const FONT_DISPLAY_OPTIONS = {
    'Instrument Serif': "'Instrument Serif', Georgia, serif",
    'Fraunces':         "'Fraunces', Georgia, serif",
    'DM Serif Display': "'DM Serif Display', Georgia, serif",
    'Inter Tight':      "'Inter Tight', system-ui, sans-serif",
  };
  const FONT_BODY_OPTIONS = {
    'Inter':       "'Inter', system-ui, sans-serif",
    'IBM Plex':    "'IBM Plex Sans', system-ui, sans-serif",
    'Inter Tight': "'Inter Tight', system-ui, sans-serif",
  };
  function setFont(scope, name) {
    if (scope === 'display') {
      root.style.setProperty('--font-display', FONT_DISPLAY_OPTIONS[name] || FONT_DISPLAY_OPTIONS['Instrument Serif']);
      localStorage.setItem(STORAGE.displayFont, name);
    } else {
      root.style.setProperty('--font-body', FONT_BODY_OPTIONS[name] || FONT_BODY_OPTIONS['Inter']);
      localStorage.setItem(STORAGE.bodyFont, name);
    }
    document.querySelectorAll(`[data-tweak="font-${scope}"] button`).forEach(b => {
      b.classList.toggle('active', b.dataset.value === name);
    });
  }
  const savedDisplay = localStorage.getItem(STORAGE.displayFont);
  if (savedDisplay) setFont('display', savedDisplay);
  const savedBody = localStorage.getItem(STORAGE.bodyFont);
  if (savedBody) setFont('body', savedBody);

  /* ---------- ACCENT ---------- */
  const ACCENT_OPTIONS = {
    signal:  { color: '#22C55E', deep: '#188A3C', soft: '#DCFCE7' },
    cobalt:  { color: '#1F4DD6', deep: '#1840B5', soft: '#DBEAFE' },
    amber:   { color: '#F59E0B', deep: '#B45309', soft: '#FEF3C7' },
    violet:  { color: '#7C3AED', deep: '#5B21B6', soft: '#EDE9FE' },
  };
  function setAccent(name) {
    const a = ACCENT_OPTIONS[name];
    if (!a) return;
    root.style.setProperty('--accent', a.color);
    root.style.setProperty('--accent-soft', a.soft);
    root.style.setProperty('--signal-deep', a.deep);
    // Note: --focus-ring stays neutral (ink/manila) — not bound to accent.
    localStorage.setItem(STORAGE.accent, name);
    document.querySelectorAll('[data-tweak="accent"] [data-value]').forEach(b => {
      b.classList.toggle('active', b.dataset.value === name);
    });
  }
  const savedAccent = localStorage.getItem(STORAGE.accent);
  if (savedAccent) setAccent(savedAccent);

  /* ---------- VERSION SWITCHER ---------- */
  const VERSION_MAP = { 'v0.13': 'versions/v0.13.html' };
  document.getElementById('version-select')?.addEventListener('change', (e) => {
    const v = e.target.value;
    if (v === 'current') return;
    if (VERSION_MAP[v]) window.location.href = VERSION_MAP[v];
  });

  /* ---------- TOC ACTIVE LINK ---------- */
  function initTocObserver() {
    const links = document.querySelectorAll('.toc-list a');
    if (!links.length) return;
    const linkMap = new Map();
    links.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) linkMap.set(id, a);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const link = linkMap.get(entry.target.id);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -65% 0px', threshold: 0 });
    linkMap.forEach((_link, id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- COPY-TO-CLIPBOARD ---------- */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      if (btn._wired) return; btn._wired = true;
      btn.classList.add('copy-btn');
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy ||
          (btn.dataset.copyTarget && document.querySelector(btn.dataset.copyTarget)?.textContent) ||
          btn.previousElementSibling?.textContent ||
          '';
        try {
          await navigator.clipboard.writeText(text.trim());
          const original = btn.textContent;
          btn.textContent = 'Copied';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove('copied');
          }, 1400);
        } catch (e) { /* ignore */ }
      });
    });
  }

  /* ---------- TWEAKS PANEL ---------- */
  function buildTweaks() {
    if (document.querySelector('.tweaks-panel')) return;
    const panel = document.createElement('div');
    panel.className = 'tweaks-panel';
    panel.innerHTML = `
      <div class="tweaks-head">
        <h6>Tweaks</h6>
        <button class="tweaks-close" aria-label="Close">✕</button>
      </div>

      <div class="tweak-row" data-tweak="theme">
        <div class="tweak-label"><span>Theme</span></div>
        <div class="tweak-segment">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
        </div>
      </div>

      <div class="tweak-row" data-tweak="density">
        <div class="tweak-label"><span>Density</span></div>
        <div class="tweak-segment">
          <button data-value="comfortable">Comfortable</button>
          <button data-value="compact">Compact</button>
        </div>
      </div>

      <div class="tweak-row" data-tweak="accent">
        <div class="tweak-label"><span>Accent color</span></div>
        <div class="tweak-swatches">
          <button class="tweak-swatch" data-value="signal" style="background:#22C55E" title="Signal green"></button>
          <button class="tweak-swatch" data-value="cobalt" style="background:#1F4DD6" title="Cobalt"></button>
          <button class="tweak-swatch" data-value="amber"  style="background:#F59E0B" title="Amber"></button>
          <button class="tweak-swatch" data-value="violet" style="background:#7C3AED" title="Violet"></button>
        </div>
      </div>

      <div class="tweak-row" data-tweak="font-display">
        <div class="tweak-label"><span>Display font</span></div>
        <div class="tweak-segment">
          <button data-value="Inter Tight" style="font-family: 'Inter Tight', sans-serif; font-size: 14px; font-weight: 500;">Tight</button>
          <button data-value="Instrument Serif" style="font-family: 'Instrument Serif', serif; font-size: 14px;">Instrument</button>
          <button data-value="Fraunces" style="font-family: 'Fraunces', serif; font-size: 14px;">Fraunces</button>
          <button data-value="DM Serif Display" style="font-family: 'DM Serif Display', serif; font-size: 14px;">DM Serif</button>
        </div>
      </div>

      <div class="tweak-row" data-tweak="font-body">
        <div class="tweak-label"><span>Body font</span></div>
        <div class="tweak-segment">
          <button data-value="Inter">Inter</button>
          <button data-value="IBM Plex">Plex</button>
          <button data-value="Inter Tight">Tight</button>
        </div>
      </div>

      <div class="tweak-row" data-tweak="annotations">
        <div class="tweak-label"><span>Token annotations</span></div>
        <div class="tweak-segment">
          <button data-value="on">On</button>
          <button data-value="off">Off</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('.tweaks-close').addEventListener('click', () => {
      panel.classList.remove('open');
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    });
    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-value]');
      if (!btn) return;
      const tweak = btn.closest('[data-tweak]').dataset.tweak;
      const val = btn.dataset.value;
      if (tweak === 'theme')        setTheme(val);
      if (tweak === 'density')      setDensity(val);
      if (tweak === 'accent')       setAccent(val);
      if (tweak === 'font-display') setFont('display', val);
      if (tweak === 'font-body')    setFont('body', val);
      if (tweak === 'annotations')  setAnnotations(val);
    });

    // Sync initial active state
    setTheme(root.getAttribute('data-theme') || 'light', false);
    setDensity(root.getAttribute('data-density') || 'comfortable');
    setAnnotations(root.getAttribute('data-annotations') || 'on');
    setFont('display', savedDisplay || 'Inter Tight');
    setFont('body',    savedBody    || 'Inter');
    setAccent(savedAccent || 'signal');
  }
  buildTweaks();

  /* Tweaks host protocol */
  window.addEventListener('message', (e) => {
    const data = e.data || {};
    if (data.type === '__activate_edit_mode') {
      document.querySelector('.tweaks-panel')?.classList.add('open');
    } else if (data.type === '__deactivate_edit_mode') {
      document.querySelector('.tweaks-panel')?.classList.remove('open');
    }
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  /* ---------- MOBILE NAV DRAWER ---------- */
  function initNavDrawer() {
    const toggle = document.getElementById('nav-toggle');
    const tocClose = document.getElementById('toc-close');
    const toc = document.getElementById('toc-nav');
    const backdrop = document.getElementById('nav-backdrop');
    if (!toggle || !toc || !backdrop) return;

    const mq = window.matchMedia('(max-width: 980px)');

    function isMobile() { return mq.matches; }

    function setOpen(open) {
      if (!isMobile()) {
        toc.classList.remove('is-open');
        backdrop.classList.remove('is-visible');
        backdrop.hidden = true;
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open sections menu');
        return;
      }
      toc.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-visible', open);
      backdrop.hidden = !open;
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close sections menu' : 'Open sections menu');
    }

    function openNav() {
      setOpen(true);
      tocClose?.focus();
    }

    function closeNav() {
      const wasOpen = toc.classList.contains('is-open');
      setOpen(false);
      if (wasOpen) toggle.focus();
    }

    toggle.addEventListener('click', () => {
      toc.classList.contains('is-open') ? closeNav() : openNav();
    });

    tocClose?.addEventListener('click', closeNav);
    backdrop.addEventListener('click', closeNav);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toc.classList.contains('is-open')) closeNav();
    });

    toc.querySelectorAll('.toc-list a').forEach(a => {
      a.addEventListener('click', closeNav);
    });

    mq.addEventListener('change', () => {
      if (!isMobile()) closeNav();
    });
  }

  /* ---------- Init on DOM ready ---------- */
  const init = () => {
    initCopyButtons();
    initTocObserver();
    initNavDrawer();
    window.dispatchEvent(new CustomEvent('ds:ready'));
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
