/* ============================================================
   PAPERCLIP CAPSULE GRAPHIC GENERATOR — embedded version
   Renders into #gen-canvas based on template + palette + params.
   ============================================================ */

(() => {
  const wrap = document.getElementById('gen-wrap');
  if (!wrap) return;

  const PALETTES = {
    rainbow: [
      ['#F7CFDC','#1F7A3A'], ['#C9A9E8','#EE79A1'], ['#F3E6C4','#E3A21A'],
      ['#1F4DD6','#3AA35C'], ['#E94B27','#5A1122'], ['#7EB6E3','#EE79A1'],
      ['#9CE8A7','#BD7FF0'], ['#F3B49E','#1F4ED4'], ['#F2D95F','#4FBCBA'],
      ['#C2C2E8','#5E3450'], ['#4DB9B7','#3AA35C'], ['#28164B','#7A1530'],
    ],
    warm: [
      ['#F3E6C4','#E3A21A'], ['#F3B49E','#E94B27'], ['#F7CFDC','#7A1530'],
      ['#F2D95F','#E3A21A'], ['#F3B49E','#1F4ED4'], ['#EE79A1','#7A1530'],
    ],
    cool: [
      ['#1F4DD6','#3AA35C'], ['#7EB6E3','#1F4DD6'], ['#4DB9B7','#3AA35C'],
      ['#C2C2E8','#5E3450'], ['#1F4DD6','#28164B'], ['#9CE8A7','#1F7A3A'],
    ],
    mono: [
      ['#1A1A1A','#4A4A4A'], ['#4A4A4A','#888880'], ['#888880','#E0DCD6'],
      ['#1A1A1A','#888880'], ['#4A4A4A','#1A1A1A'],
    ],
    signal: [
      ['#DCFCE7','#188A3C'], ['#9CE8A7','#22C55E'], ['#22C55E','#188A3C'],
      ['#9CE8A7','#1F7A3A'], ['#DCFCE7','#22C55E'],
    ],
    duotone: [
      ['#F3E6C4','#0C0C0C'], ['#F3E6C4','#1A1A1A'], ['#F0ECE7','#0C0C0C'],
    ],
  };
  const BG = {
    bond: '#FFFFFF', linen: '#F5F3F0', parchment: '#F0ECE7',
    manila: '#F3E6C4', ink: '#1A1A1A', void: '#0C0C0C',
  };

  // Mulberry32 PRNG so randomize is reproducible
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  let seed = Math.floor(Math.random() * 1e9);

  const state = {
    template: 'blend-row',
    palette: 'rainbow',
    count: 8,
    width: 32,
    height: 200,
    jitter: 40,
    gap: 8,
    bg: 'bond',
  };

  function pick(palette, r) {
    const list = PALETTES[palette] || PALETTES.rainbow;
    return list[Math.floor(r() * list.length)];
  }

  function gradient(a, b) {
    return `linear-gradient(to bottom, ${a}, ${b})`;
  }

  function render() {
    const canvas = document.getElementById('gen-canvas');
    const wrapEl = document.getElementById('gen-canvas-wrap');
    if (!canvas || !wrapEl) return;
    wrapEl.style.background = BG[state.bg];
    canvas.innerHTML = '';
    const r = rng(seed);

    if (state.template === 'blend-row') {
      const row = document.createElement('div');
      row.style.cssText = `display:flex;align-items:flex-end;gap:${state.gap}px;justify-content:center;width:100%;height:${state.height + 40}px`;
      for (let i = 0; i < state.count; i++) {
        const [a, b] = pick(state.palette, r);
        const jitter = (r() - 0.5) * state.jitter * 2;
        const h = Math.max(40, state.height + jitter);
        const cap = document.createElement('div');
        cap.style.cssText = `width:${state.width}px;height:${h}px;border-radius:9999px;flex-shrink:0;background:${gradient(a,b)}`;
        row.appendChild(cap);
      }
      canvas.appendChild(row);

    } else if (state.template === 'chain') {
      // Vertical chain of horizontal capsules, slightly overlapping
      const col = document.createElement('div');
      col.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:${-state.width / 3}px;justify-content:center;width:100%`;
      const capLen = state.height * 0.6;
      for (let i = 0; i < state.count; i++) {
        const [a, b] = pick(state.palette, r);
        const rotate = (r() - 0.5) * 60;
        const cap = document.createElement('div');
        cap.style.cssText = `width:${state.width * 2.4}px;height:${state.width}px;border-radius:9999px;background:${gradient(a,b)};transform:rotate(${rotate}deg);box-shadow:0 0 0 2px ${BG[state.bg]}`;
        col.appendChild(cap);
      }
      canvas.appendChild(col);

    } else if (state.template === 'bar-stack') {
      // Stacked capsule segments forming bars
      const row = document.createElement('div');
      row.style.cssText = `display:flex;align-items:flex-end;gap:${state.gap * 2}px;justify-content:center;width:100%;height:${state.height + 40}px`;
      for (let i = 0; i < state.count; i++) {
        const segs = 3 + Math.floor(r() * 4);
        const segH = Math.max(20, (state.height + (r() - 0.5) * state.jitter) / segs);
        const bar = document.createElement('div');
        bar.style.cssText = `display:flex;flex-direction:column;gap:2px;width:${state.width}px`;
        for (let j = 0; j < segs; j++) {
          const [a, b] = pick(state.palette, r);
          const seg = document.createElement('div');
          seg.style.cssText = `height:${segH}px;border-radius:9999px;background:${gradient(a,b)}`;
          bar.appendChild(seg);
        }
        row.appendChild(bar);
      }
      canvas.appendChild(row);

    } else if (state.template === 'grid') {
      // Uniform grid of capsules
      const cols = Math.max(2, Math.min(state.count, 8));
      const rows = Math.max(2, Math.floor(state.count / cols));
      const grid = document.createElement('div');
      grid.style.cssText = `display:grid;grid-template-columns:repeat(${cols}, ${state.width}px);gap:${state.gap}px;justify-content:center`;
      for (let i = 0; i < cols * rows; i++) {
        const [a, b] = pick(state.palette, r);
        const cap = document.createElement('div');
        cap.style.cssText = `width:${state.width}px;height:${state.width * 2}px;border-radius:9999px;background:${gradient(a,b)}`;
        grid.appendChild(cap);
      }
      canvas.appendChild(grid);

    } else if (state.template === 'hero') {
      // One big hero capsule
      const [a, b] = pick(state.palette, r);
      const hero = document.createElement('div');
      hero.style.cssText = `width:${state.width * 2}px;height:${state.height * 1.3}px;border-radius:9999px;background:${gradient(a,b)}`;
      canvas.appendChild(hero);

    } else if (state.template === 'icon') {
      // Paperclip-shape icon out of capsules
      const wrapEl = document.createElement('div');
      wrapEl.style.cssText = `display:flex;align-items:center;justify-content:center;height:${state.height + 40}px`;
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      const size = state.height + 40;
      svg.setAttribute('width', size); svg.setAttribute('height', size);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      const [a, b] = pick(state.palette, r);
      const defs = document.createElementNS(svgNS, 'defs');
      defs.innerHTML = `<linearGradient id="gen-icon-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
      svg.appendChild(defs);
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'm16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551');
      path.setAttribute('stroke', 'url(#gen-icon-grad)');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(path);
      wrapEl.appendChild(svg);
      canvas.appendChild(wrapEl);
    }
  }

  // Wire controls
  document.getElementById('gen-templates').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-tpl]');
    if (!btn) return;
    document.querySelectorAll('.gen-tpl').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.template = btn.dataset.tpl;
    render();
  });

  document.getElementById('gen-palette').addEventListener('change', (e) => {
    state.palette = e.target.value;
    render();
  });

  ['count', 'width', 'height', 'jitter', 'gap'].forEach(k => {
    const slider = document.getElementById(`gen-${k}`);
    const val = document.getElementById(`gen-${k}-v`);
    slider.addEventListener('input', () => {
      state[k] = parseInt(slider.value, 10);
      val.textContent = slider.value;
      render();
    });
  });

  document.querySelectorAll('.gen-bg').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.gen-bg').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.bg = b.dataset.bg;
      render();
    });
  });

  document.getElementById('gen-randomize').addEventListener('click', () => {
    seed = Math.floor(Math.random() * 1e9);
    const tpls = ['blend-row','chain','bar-stack','grid','hero','icon'];
    const pals = Object.keys(PALETTES);
    state.template = tpls[Math.floor(Math.random()*tpls.length)];
    state.palette = pals[Math.floor(Math.random()*pals.length)];
    state.count = 4 + Math.floor(Math.random()*10);
    state.width = 16 + Math.floor(Math.random()*48);
    state.jitter = Math.floor(Math.random()*80);
    state.gap = Math.floor(Math.random()*20);
    document.querySelectorAll('.gen-tpl').forEach(b => b.classList.toggle('active', b.dataset.tpl === state.template));
    document.getElementById('gen-palette').value = state.palette;
    document.getElementById('gen-count').value = state.count; document.getElementById('gen-count-v').textContent = state.count;
    document.getElementById('gen-width').value = state.width; document.getElementById('gen-width-v').textContent = state.width;
    document.getElementById('gen-jitter').value = state.jitter; document.getElementById('gen-jitter-v').textContent = state.jitter;
    document.getElementById('gen-gap').value = state.gap; document.getElementById('gen-gap-v').textContent = state.gap;
    render();
  });

  render();
})();
