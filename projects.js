/* Portfolio interactivity: project grid, filters, modal, terminal, live GitHub stats */
(() => {
  const GH = 'https://github.com/susheel7860/';

  const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'cv', label: 'Computer Vision' },
    { id: 'llm', label: 'LLM & GenAI' },
    { id: 'automation', label: 'Automation' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'data', label: 'Data & Geo' },
  ];

  const PROJECTS = [
    {
      id: 'dms', title: 'Driver Monitoring System', cats: ['cv'], status: 'Production',
      summary: 'Real-time drowsiness and distraction detection for fleet vehicles, optimized for edge devices.',
      stack: ['YOLO v7', 'PyTorch', 'Quantization', 'Edge AI'],
      highlights: ['97%+ detection accuracy', 'Under 150 ms response time on edge hardware', 'Deployed in fleet management systems'],
    },
    {
      id: 'reid', title: 'ReID ArcFace Pipeline', cats: ['cv'], status: 'Open Source', repo: 'reid-arcface-pipeline',
      summary: 'Multi-object tracking that keeps identities stable through occlusions using appearance embeddings.',
      stack: ['Python', 'PyTorch', 'Ultralytics YOLO', 'Hungarian matching'],
      highlights: ['YOLO detection with class filtering and CPU fallback', '512-d L2-normalized appearance embeddings, batched', 'Cosine-similarity Hungarian matching with lost-track memory and re-identification', 'Per-frame JSONL output, webcam and batch modes'],
    },
    {
      id: 'face', title: 'Face Verification Service', cats: ['cv'], status: 'Private',
      summary: 'ArcFace-based face verification model served through a FastAPI microservice.',
      stack: ['ArcFace', 'FastAPI', 'Python', 'Docker'],
      highlights: ['1:1 face verification with ArcFace embeddings', 'FastAPI inference service with setup and deploy scripts', 'Documented with MkDocs'],
    },
    {
      id: 'footfall', title: 'Footfall Analysis LLM Agent Platform', cats: ['llm', 'data'], status: 'Production',
      summary: 'Multi-agent system that turns natural-language questions into SQL, spatial queries and BI insights.',
      stack: ['Mistral 7B', 'LLaMA 3 70B', 'PostGIS', 'Pydeck', 'FastAPI'],
      highlights: ['Intent Agent, SQL Generator, Executor and Summarizer working together', '1M+ mobility records per day, ~50 concurrent users', 'Schema-aware SQL generation with automated validation', '100+ test-case framework, 75% less manual testing'],
    },
    {
      id: 'avf', title: 'Local AI Video Factory', cats: ['llm', 'automation'], status: 'Private',
      summary: 'One command from topic to finished animated episode, fully local on an 8 GB laptop GPU.',
      stack: ['Ollama', 'FLUX', 'Wan2.2', 'ComfyUI API', 'Piper TTS', 'FFmpeg'],
      highlights: ['Pipeline: story → scene images → animation → narration → edit → QC', 'ComfyUI driven headlessly over its HTTP API', 'Character-consistent scenes with job queue and review stage', 'Runs on an RTX 4060 Laptop (8 GB VRAM)'],
    },
    {
      id: 'autokit', title: 'Automation Kit', cats: ['automation', 'llm'], status: 'Open Source', repo: 'automation-kit',
      summary: 'Five runnable LLM automations for small-business busywork, plus a pipeline that turns each into a narrated demo video.',
      stack: ['Bash', 'Claude CLI', 'Python', 'Piper TTS', 'FFmpeg'],
      highlights: ['Doc Q&A bot, invoice-to-CSV, lead follow-ups, weekly reports, social repurposing', 'Each script is 30–50 lines with sample data included', 'Auto-generates 1080x1920 demo shorts from JSON scene files'],
    },
    {
      id: 'tvf', title: 'Terminal Video Factory', cats: ['automation'], status: 'Open Source', repo: 'terminal-video-factory',
      summary: 'Turns a small JSON file into a captioned, narrated vertical video of a real terminal session.',
      stack: ['Python', 'asciinema', 'agg', 'Piper TTS', 'FFmpeg'],
      highlights: ['No screen recorder, microphone or video editor needed', 'Scripted terminal sessions rendered to GIF, then composed with voice and captions', '~25s 1080x1920 shorts from one command'],
    },
    {
      id: 'aas', title: 'AI Automation Scripts', cats: ['automation', 'llm'], status: 'Open Source', repo: 'ai-automation-scripts',
      summary: 'Small, readable LLM-powered tools for the admin work people still do by hand.',
      stack: ['Bash', 'Claude CLI'],
      highlights: ['Five tools, each short enough to read in one sitting', 'No API-key plumbing: runs wherever the CLI runs'],
    },
    {
      id: 'paisawise', title: 'PaisaWise: Smart Spending Tracker', cats: ['fullstack'], status: 'Private',
      summary: 'Full-stack personal finance app that tracks spending automatically by parsing order emails.',
      stack: ['React 19', 'Vite', 'FastAPI', 'Gmail API', 'Docker', 'Caddy', 'Capacitor'],
      highlights: ['Gmail integration parses Zomato, Uber and other order confirmations', 'Chat-style manual expense logging', 'Free/Pro plans, encrypted session tokens', 'Production Docker + Caddy auto-HTTPS stack, Android/iOS via Capacitor'],
    },
    {
      id: 'jigsaw', title: 'Desi Jigsaw', cats: ['fullstack'], status: 'Private',
      summary: 'Ad-supported jigsaw puzzle game for the Indian market: playable web demo plus Unity Android app in progress.',
      stack: ['Unity', 'C#', 'JavaScript', 'AdMob'],
      highlights: ['Web demo defines gameplay and look', 'Unity Android build targeting Google Play'],
    },
    {
      id: 'scrapers', title: 'Event Data Scrapers', cats: ['data', 'automation'], status: 'Private',
      summary: 'Apify actors that scrape Eventbrite and Luma into clean, structured event and organizer data.',
      stack: ['Node.js', 'Apify SDK', 'undici'],
      highlights: ['Handles search, city, category, organizer and single-event URLs', 'Organizer enrichment: website and social handles', 'Geo-coordinates, categories, ticket info, attendee counts'],
    },
    {
      id: 'geo', title: 'Geospatial AI & 3D Automation', cats: ['data', 'cv'], status: 'Production',
      summary: 'QGIS plugins for satellite imagery analysis and automated city-scale 3D building generation.',
      stack: ['QGIS', 'PostGIS', 'Python', 'DEM / aerial imagery'],
      highlights: ['65% less manual 3D modeling effort', '40% smaller models, 25% data-accuracy gain'],
    },
    {
      id: 'amazon', title: 'Amazon Food Review System', cats: ['data', 'llm'], status: 'Open Source', repo: 'amazon-food-review-system',
      summary: 'Data-preparation stage of a review sentiment classifier: profiling, labeling and deduplication.',
      stack: ['Python', 'pandas', 'NLP'],
      highlights: ['Dataset profiling and cleaning CLI', 'Neutral reviews dropped, the rest labeled positive/negative', 'Deduplication and clean CSV export'],
    },
    {
      id: 'lscripts', title: 'lscripts-docker', cats: ['fullstack'], status: 'Open Source', repo: 'lscripts-docker',
      summary: 'Shell framework for reproducible ML workstations: CUDA, ROS, Mongo and TensorFlow Docker images.',
      stack: ['Bash', 'Docker', 'CUDA'],
      highlights: ['Image build and container scripts for common ML stacks', 'Cuts manual system setup to a few commands'],
    },
  ];

  const $ = (sel) => document.querySelector(sel);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const catLabel = (id) => CATEGORIES.find((c) => c.id === id).label;
  const statusClass = (s) => s.toLowerCase().replace(/\s+/g, '-');

  // ---------- project grid ----------
  let filter = 'all';
  let query = '';
  const grid = $('#project-grid');
  const chips = $('#filter-chips');
  const search = $('#project-search');
  const count = $('#project-count');

  chips.innerHTML = CATEGORIES.map((c) => {
    const n = c.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.cats.includes(c.id)).length;
    return `<button class="chip${c.id === 'all' ? ' active' : ''}" data-cat="${c.id}" role="tab">${c.label}<span>${n}</span></button>`;
  }).join('');

  grid.innerHTML = PROJECTS.map((p) => `
    <article class="pcard" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(p.title)} details">
      <div class="pcard-top">
        <span class="status ${statusClass(p.status)}">${p.status}</span>
        <span class="pcard-cats">${p.cats.map(catLabel).join(' · ')}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <div class="pcard-stack">${p.stack.slice(0, 4).map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      <div class="pcard-foot">
        <span class="more">Details →</span>
        ${p.repo ? `<a class="gh" href="${GH + p.repo}" target="_blank" rel="noopener" data-stop>GitHub ↗</a>` : ''}
      </div>
    </article>`).join('');

  const apply = () => {
    let shown = 0;
    grid.querySelectorAll('.pcard').forEach((el) => {
      const p = PROJECTS.find((x) => x.id === el.dataset.id);
      const hay = (p.title + ' ' + p.summary + ' ' + p.stack.join(' ') + ' ' + p.status).toLowerCase();
      const ok = (filter === 'all' || p.cats.includes(filter)) && (!query || hay.includes(query));
      el.classList.toggle('hidden', !ok);
      if (ok) shown++;
    });
    chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c.dataset.cat === filter));
    count.textContent = shown ? `Showing ${shown} of ${PROJECTS.length} projects` : 'No projects match. Try another filter.';
  };

  const setFilter = (cat, scroll) => {
    filter = cat;
    apply();
    if (scroll) document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  };

  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (b) setFilter(b.dataset.cat);
  });
  search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); apply(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); search.focus(); }
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.expertise-card[data-filter]').forEach((card) => {
    const go = () => setFilter(card.dataset.filter, true);
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  // ---------- modal ----------
  const modal = $('#project-modal');
  const openModal = (id) => {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return false;
    $('#modal-content').innerHTML = `
      <span class="status ${statusClass(p.status)}">${p.status}</span>
      <h3 id="modal-title">${esc(p.title)}</h3>
      <p class="modal-summary">${esc(p.summary)}</p>
      <h4>Highlights</h4>
      <ul class="project-highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <h4>Stack</h4>
      <div class="pcard-stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      ${p.repo
        ? `<a class="btn btn-primary modal-btn" href="${GH + p.repo}" target="_blank" rel="noopener">View on GitHub ↗</a>`
        : `<p class="modal-note">${p.status === 'Production' ? 'Built at MapmyIndia; code is proprietary.' : 'Private repository. Walkthrough available on request.'}</p>`}`;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();
    return true;
  };
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  grid.addEventListener('click', (e) => {
    if (e.target.closest('[data-stop]')) return;
    const card = e.target.closest('.pcard');
    if (card) openModal(card.dataset.id);
  });
  grid.addEventListener('keydown', (e) => {
    const card = e.target.closest('.pcard');
    if (card && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-stop]')) { e.preventDefault(); openModal(card.dataset.id); }
  });

  apply();

  // ---------- live GitHub stats ----------
  fetch('https://api.github.com/users/susheel7860/repos?per_page=100&sort=pushed')
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((repos) => {
      const own = repos.filter((r) => !r.fork && r.name !== 'susheel7860');
      const langs = {};
      own.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
      const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([l]) => l);
      const latest = own[0];
      const box = $('#gh-live');
      box.innerHTML = `
        <span class="live-dot"></span><strong>Live from GitHub</strong>
        <span>${own.length} public repos</span>
        ${top.length ? `<span>Top languages: ${top.map(esc).join(', ')}</span>` : ''}
        ${latest ? `<span>Latest push: <a href="${latest.html_url}" target="_blank" rel="noopener">${esc(latest.name)}</a> · ${new Date(latest.pushed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>` : ''}`;
      box.hidden = false;
    })
    .catch(() => {});

  // ---------- terminal ----------
  const body = $('#terminal-body');
  const form = $('#terminal-form');
  const input = $('#terminal-cmd');
  const hints = $('#terminal-hints');
  const history = [];
  let hIdx = 0;

  const print = (html, cls = '') => {
    const line = document.createElement('div');
    line.className = 'tline ' + cls;
    line.innerHTML = html;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  };

  const COMMANDS = {
    help: () => print(Object.keys(COMMANDS).filter((k) => !k.startsWith('sudo')).map((k) => `<span class="k">${k}</span>`).join('  ')),
    whoami: () => print('Susheel Kumar Pandey: AI/ML Engineer, Computer Vision &amp; LLM Automation. Sr. Software Engineer @ MapmyIndia, New Delhi.'),
    skills: () => print([
      '<span class="k">vision</span>   YOLO v5/v7/v8 · ArcFace · Mask R-CNN · ReID tracking · edge quantization',
      '<span class="k">llm</span>      multi-agent systems · Mistral · LLaMA 3 · LangChain · Ollama · ComfyUI',
      '<span class="k">data</span>     PostgreSQL · PostGIS · Pydeck · QGIS · pandas',
      '<span class="k">eng</span>      Python · FastAPI · React · Docker · CI/CD · Bash',
    ].join('<br>')),
    projects: () => {
      print(PROJECTS.map((p) => `<span class="k">${p.id.padEnd(10, ' ').replace(/ /g, '&nbsp;')}</span>${esc(p.title)}`).join('<br>'));
      print('try: <span class="k">open reid</span>', 'muted');
    },
    open: (arg) => {
      if (!arg) return print('usage: open &lt;project-id&gt;  (see <span class="k">projects</span>)', 'muted');
      if (!openModal(arg)) print(`open: no such project: ${esc(arg)}`, 'err');
    },
    filter: (arg) => {
      const c = CATEGORIES.find((x) => x.id === arg);
      if (!c) return print('usage: filter ' + CATEGORIES.map((x) => x.id).join('|'), 'muted');
      setFilter(c.id, true);
      print(`showing ${c.label} projects ↓`);
    },
    experience: () => print('2024–now  Senior Software Engineer @ MapmyIndia<br>2022–2024 Software Engineer @ MapmyIndia<br>2021–2022 Trainee Engineer @ MapmyIndia'),
    contact: () => print('<a href="mailto:susheel123pandey@gmail.com">susheel123pandey@gmail.com</a> · <a href="https://linkedin.com/in/susheel7860" target="_blank" rel="noopener">linkedin</a> · <a href="https://github.com/susheel7860" target="_blank" rel="noopener">github</a>'),
    github: () => { window.open('https://github.com/susheel7860', '_blank', 'noopener'); print('opening github.com/susheel7860 ↗'); },
    clear: () => { body.innerHTML = ''; },
    'sudo': (arg) => {
      if (arg === 'hire-me') { print('permission granted ✓ scrolling to contact…', 'ok'); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }
      else print('nice try 🙂', 'muted');
    },
  };

  const run = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    print(`<span class="prompt">$</span> ${esc(cmd)}`, 'echo');
    history.push(cmd); hIdx = history.length;
    const [name, ...rest] = cmd.split(/\s+/);
    const fn = COMMANDS[name.toLowerCase()];
    if (fn) fn(rest.join(' ').toLowerCase());
    else print(`command not found: ${esc(name)}. Type <span class="k">help</span>`, 'err');
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; e.preventDefault(); }
    if (e.key === 'Tab') {
      const m = Object.keys(COMMANDS).find((k) => k.startsWith(input.value) && input.value);
      if (m) { input.value = m + ' '; e.preventDefault(); }
    }
  });
  $('#terminal').addEventListener('click', (e) => { if (!e.target.closest('a,button')) input.focus({ preventScroll: true }); });

  hints.innerHTML = ['whoami', 'skills', 'projects', 'open avf', 'sudo hire-me'].map((c) => `<button type="button">${c}</button>`).join('');
  hints.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) run(b.textContent); });

  // boot sequence: types `whoami` once, then waits for the visitor
  const boot = 'whoami';
  let i = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  print('Welcome! This terminal works. Type <span class="k">help</span> or tap a command below.', 'muted');
  if (reduce) run(boot);
  else {
    const t = setInterval(() => {
      input.value = boot.slice(0, ++i);
      if (i === boot.length) { clearInterval(t); setTimeout(() => { run(boot); input.value = ''; }, 250); }
    }, 90);
  }
})();

// Reveal the page as soon as the DOM is ready instead of waiting for web fonts/network (window.load)
document.body.classList.add('loaded');
