/* Visual effects: hero network, rotator, counters, hex hotspot map, scroll UI, card spotlight */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (id) => document.getElementById(id);

  // Run a per-frame callback only while `el` is on screen
  // (IntersectionObserver, plus a scroll/resize check as a fallback)
  const whileVisible = (el, frame) => {
    let raf = 0;
    let on = false;
    const loop = () => { frame(); raf = requestAnimationFrame(loop); };
    const set = (visible) => {
      if (visible && !on) { on = true; raf = requestAnimationFrame(loop); }
      else if (!visible && on) { on = false; cancelAnimationFrame(raf); }
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      set(r.bottom > 0 && r.top < window.innerHeight);
    };
    new IntersectionObserver(([e]) => set(e.isIntersecting)).observe(el);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
  };

  const sizeCanvas = (canvas) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: r.width, h: r.height };
  };

  // ---------- hero neural network ----------
  const hero = $('hero-canvas');
  if (hero) {
    let { ctx, w, h } = sizeCanvas(hero);
    const mouse = { x: -9999, y: -9999 };
    const count = () => Math.round(Math.min(90, Math.max(30, (w * h) / 16000)));
    const make = () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8, hue: Math.random() < 0.6 ? '0,212,255' : '123,92,255',
    });
    let nodes = Array.from({ length: count() }, make);
    const LINK = 130;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduceMotion) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
          if (d < 180 && d > 1) { n.x += (dx / d) * 0.35; n.y += (dy / d) * 0.35; }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / LINK) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 180) {
          ctx.strokeStyle = `rgba(123,92,255,${(1 - md / 180) * 0.45})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${a.hue},${md < 180 ? 0.95 : 0.6})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r + (md < 180 ? 1 : 0), 0, Math.PI * 2); ctx.fill();
      }
    };

    const heroEl = hero.parentElement;
    heroEl.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    heroEl.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    window.addEventListener('resize', () => {
      ({ ctx, w, h } = sizeCanvas(hero));
      nodes = Array.from({ length: count() }, make);
      if (reduceMotion) draw();
    });
    if (reduceMotion) draw(); else whileVisible(hero, draw);
  }

  // ---------- rotating role text ----------
  const rot = $('rotator');
  if (rot && !reduceMotion) {
    const phrases = ['multi-agent LLM systems', 'geospatial platforms on AWS', 'real-time computer vision', 'edge AI under 150 ms', 'scalable FastAPI backends'];
    let p = 0, i = phrases[0].length, deleting = true;
    const tick = () => {
      const word = phrases[p];
      i += deleting ? -1 : 1;
      rot.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
      else if (!deleting && i === phrases[p].length) { deleting = true; delay = 2200; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2600);
  }

  // ---------- stat counters ----------
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countObs.unobserve(e.target);
      const el = e.target, end = +el.dataset.count;
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      if (reduceMotion) return;
      const t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
        el.textContent = pre + v + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => countObs.observe(c));

  // ---------- hex hotspot map (ATLAS) ----------
  const hex = $('hexmap');
  if (hex) {
    const tip = $('hexmap-tip');
    let { ctx, w, h } = sizeCanvas(hex);
    const R = 13;
    const HW = Math.sqrt(3) * R;
    let cells = [];
    let hover = -1;
    const spots = [
      { x: 0.28, y: 0.35, s: 0.16, a: 1 },
      { x: 0.68, y: 0.6, s: 0.2, a: 0.9 },
      { x: 0.55, y: 0.2, s: 0.1, a: 0.6 },
      { x: 0.15, y: 0.78, s: 0.12, a: 0.5 },
    ];
    const ramp = [[18, 30, 48], [0, 140, 200], [0, 212, 255], [123, 92, 255], [255, 107, 107], [255, 215, 0]];
    const color = (v, alpha) => {
      const x = Math.max(0, Math.min(0.999, v)) * (ramp.length - 1), i = Math.floor(x), f = x - i;
      const c = ramp[i].map((ch, k) => Math.round(ch + (ramp[i + 1][k] - ch) * f));
      return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
    };

    const build = () => {
      cells = [];
      for (let row = 0, y = R; y < h + R; row++, y += R * 1.5) {
        for (let x = (row % 2 ? HW / 2 : 0) + HW / 2; x < w + HW; x += HW) cells.push({ x, y, v: 0, shown: 0 });
      }
    };
    build();

    const path = (x, y, r) => {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const ang = Math.PI / 180 * (60 * k - 30);
        ctx.lineTo(x + r * Math.cos(ang), y + r * Math.sin(ang));
      }
      ctx.closePath();
    };

    let t0 = 0;
    const draw = () => {
      const now = performance.now();
      if (!t0) t0 = now; // reveal starts the first time the map is drawn (i.e. scrolled into view)
      const time = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      const sweep = reduceMotion ? 2 : Math.min(2, time / 1.4);
      cells.forEach((c, idx) => {
        const nx = c.x / w, ny = c.y / h;
        let v = 0;
        for (const s of spots) {
          const pulse = reduceMotion ? 1 : 1 + 0.08 * Math.sin(time * 1.5 + s.x * 10);
          v += s.a * pulse * Math.exp(-((nx - s.x) ** 2 + (ny - s.y) ** 2) / (2 * s.s * s.s));
        }
        c.v = Math.min(1, v);
        const reveal = Math.max(0, Math.min(1, (sweep - nx) * 3));
        if (reveal <= 0) return;
        const isHover = idx === hover;
        path(c.x, c.y, (R - 1.5) * (isHover ? 1.12 : 1));
        ctx.fillStyle = color(c.v, (0.25 + c.v * 0.7) * reveal);
        ctx.fill();
        if (isHover) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
      });
    };

    const pick = (mx, my) => {
      let best = -1, bd = Infinity;
      cells.forEach((c, i) => { const d = (c.x - mx) ** 2 + (c.y - my) ** 2; if (d < bd) { bd = d; best = i; } });
      return bd < R * R ? best : -1;
    };
    const show = (e) => {
      const r = hex.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
      hover = pick(mx, my);
      if (hover < 0) { tip.hidden = true; return; }
      const c = cells[hover];
      const rank = cells.filter((o) => o.v > c.v).length + 1;
      tip.innerHTML = `<b>${(c.v * 100).toFixed(0)}</b> hotspot score<span>rank #${rank} of ${cells.length} cells</span>`;
      tip.style.left = Math.min(mx + 14, w - 150) + 'px';
      tip.style.top = Math.max(my - 50, 4) + 'px';
      tip.hidden = false;
      if (reduceMotion) draw();
    };
    hex.addEventListener('pointermove', show);
    hex.addEventListener('pointerdown', show);
    hex.addEventListener('pointerleave', () => { hover = -1; tip.hidden = true; if (reduceMotion) draw(); });
    window.addEventListener('resize', () => { ({ ctx, w, h } = sizeCanvas(hex)); build(); if (reduceMotion) draw(); });
    if (reduceMotion) draw(); else whileVisible(hex, draw);
  }

  // ---------- scroll UI: progress bar, active nav, timeline fill, back-to-top ----------
  const bar = $('scroll-progress');
  const toTop = $('to-top');
  const tl = document.querySelector('.timeline');
  const tlFill = $('timeline-progress');
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    toTop.classList.toggle('show', y > vh * 0.8);
    let current = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top < vh * 0.4) current = s.id; });
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    if (tl && tlFill) {
      const r = tl.getBoundingClientRect();
      const k = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height));
      tlFill.style.transform = `scaleY(${k})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // ---------- cursor glow + card spotlight (mouse only) ----------
  if (finePointer && !reduceMotion) {
    const glow = $('cursor-glow');
    let gx = 0, gy = 0, tx = 0, ty = 0, moving = false;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY; glow.classList.add('on');
      if (!moving) { moving = true; requestAnimationFrame(follow); }
    });
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));
    function follow() {
      gx += (tx - gx) * 0.15; gy += (ty - gy) * 0.15;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      if (Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5) requestAnimationFrame(follow); else moving = false;
    }
  }
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest && e.target.closest('.pcard');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', e.clientX - r.left + 'px');
    card.style.setProperty('--my', e.clientY - r.top + 'px');
  });
})();
