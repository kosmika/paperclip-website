/* Auto-generated from src/components/brand/sections/*.html
 * Concatenated inline section scripts extracted during the Astro port.
 * Each block was already wrapped in an IIFE in the source HTML.
 * Regenerate via: node scripts/extract-brand-scripts.mjs
 */

/* ── 04-color.html ── */
(() => {
        const PRESETS = [
          ['#F7CFDC','#1F7A3A'], ['#C9A9E8','#EE79A1'], ['#28164B','#7A1530'],
          ['#F3E6C4','#E3A21A'], ['#1F4DD6','#3AA35C'], ['#E94B27','#5A1122'],
          ['#7EB6E3','#EE79A1'], ['#9CE8A7','#BD7FF0'], ['#F3B49E','#1F4ED4'],
          ['#F2D95F','#4FBCBA'], ['#C2C2E8','#5E3450'], ['#4DB9B7','#3AA35C'],
        ];
        const top = document.getElementById('cc-top');
        const bot = document.getElementById('cc-bot');
        const preview = document.getElementById('cc-preview');
        const readout = document.getElementById('cc-readout');
        const rnd = document.getElementById('cc-randomize');
        function update() {
          const mode = document.querySelector('input[name="cc-mode"]:checked')?.value;
          if (mode === 'flat') {
            preview.style.background = top.value;
            readout.textContent = top.value;
          } else {
            preview.style.background = `linear-gradient(to bottom, ${top.value}, ${bot.value})`;
            readout.textContent = `linear-gradient(to bottom, ${top.value}, ${bot.value})`;
          }
        }
        [top, bot].forEach(i => i.addEventListener('input', update));
        document.querySelectorAll('input[name="cc-mode"]').forEach(r => r.addEventListener('change', update));
        rnd.addEventListener('click', () => {
          const all = PRESETS.flat();
          let a = all[Math.floor(Math.random()*all.length)];
          let b; do { b = all[Math.floor(Math.random()*all.length)]; } while (b === a);
          top.value = a; bot.value = b;
          update();
        });
      })();

/* ── 10-motion.html ── */
(() => {
      const stagger = document.querySelector('[data-demo="stagger"] #m-stagger');
      const staggerBtn = document.querySelector('[data-demo="stagger"]');
      function playStagger() {
        stagger.classList.remove('m-stagger-go');
        void stagger.offsetWidth;
        stagger.classList.add('m-stagger-go');
      }
      if (staggerBtn) { staggerBtn.addEventListener('click', playStagger); playStagger(); }

      const reveal = document.querySelector('[data-demo="reveal"] #m-reveal');
      const revealBtn = document.querySelector('[data-demo="reveal"]');
      function playReveal() {
        reveal.classList.remove('m-reveal-go');
        void reveal.offsetWidth;
        reveal.classList.add('m-reveal-go');
      }
      if (revealBtn) { revealBtn.addEventListener('click', playReveal); playReveal(); }

      document.getElementById('m-theme-light')?.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('pds-theme', 'light');
      });
      document.getElementById('m-theme-dark')?.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('pds-theme', 'dark');
      });
    })();

/* ── 11-components.html ── */
(() => {
        // Dropdown menu
        const trigger = document.getElementById('dd-trigger');
        const menu = document.getElementById('dd-menu');
        const chev = document.getElementById('dd-chev');
        if (trigger && menu) {
          const close = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); chev.textContent = '▼'; };
          const open  = () => { menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); chev.textContent = '▲'; };
          trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.hidden ? open() : close();
          });
          document.addEventListener('click', (e) => {
            if (!menu.hidden && !menu.contains(e.target) && e.target !== trigger) close();
          });
          menu.querySelectorAll('.dd-item').forEach(item => {
            item.addEventListener('click', () => close());
          });
        }

        // Tabs
        const tabs = document.querySelectorAll('#ex-tabs .tab-btn');
        const panels = document.querySelectorAll('#ex-tabs .tab-panel');
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => {
              const active = t === tab;
              t.classList.toggle('active', active);
              t.style.color = active ? 'var(--text)' : 'var(--text-2)';
              t.style.borderBottomColor = active ? 'var(--text)' : 'transparent';
            });
            panels.forEach(p => { p.hidden = p.dataset.panel !== target; });
          });
        });

        // Pagination
        const pgWrap = document.getElementById('ex-pagination');
        if (pgWrap) {
          const nums = pgWrap.querySelectorAll('.pg-num');
          const prev = pgWrap.querySelector('.pg-prev');
          const next = pgWrap.querySelector('.pg-next');
          let current = 2;
          const visible = [1,2,3,4,42];
          function paint() {
            nums.forEach(n => {
              const p = parseInt(n.dataset.page, 10);
              const active = p === current;
              n.classList.toggle('active', active);
              if (active) {
                n.style.background = 'var(--text)';
                n.style.color = 'var(--bg)';
                n.style.borderRadius = '6px';
              } else {
                n.style.background = 'transparent';
                n.style.color = 'var(--text-muted)';
              }
            });
          }
          nums.forEach(n => n.addEventListener('click', () => {
            current = parseInt(n.dataset.page, 10);
            paint();
          }));
          prev && prev.addEventListener('click', () => {
            const idx = visible.indexOf(current);
            if (idx > 0) { current = visible[idx-1]; paint(); }
          });
          next && next.addEventListener('click', () => {
            const idx = visible.indexOf(current);
            if (idx < visible.length-1) { current = visible[idx+1]; paint(); }
          });
        }
      })();

(() => {
      const budgetRange = document.getElementById('budget-popover-range');
      const budgetValue = document.getElementById('budget-popover-value');
      if (!budgetRange || !budgetValue) return;
      const updateBudget = () => { budgetValue.textContent = `$${budgetRange.value}`; };
      budgetRange.addEventListener('input', updateBudget);
    })();
