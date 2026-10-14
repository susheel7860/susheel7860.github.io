/* Portfolio interactivity: project grid, filters, modal, terminal, live GitHub stats */
(() => {
  const GH = 'https://github.com/susheel7860/';

  const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'cv', label: 'Computer Vision' },
    { id: 'llm', label: 'LLM & GenAI' },
    { id: 'geo', label: 'Geospatial' },
    { id: 'platform', label: 'Platform & MLOps' },
  ];

  const PROJECTS = [
    {
      id: 'atlas', title: 'ATLAS: Geospatial Market-Intelligence Platform', cats: ['geo', 'platform'], status: 'ClarityX',
      summary: 'Full backend of a multi-tenant retail site-selection platform: city prioritisation, micro-hotspot, pincode and catchment analysis.',
      stack: ['Python', 'FastAPI', 'Async SQLAlchemy', 'PostGIS', 'AWS', 'GitLab CI'],
      highlights: ['55k LOC Python/FastAPI, 27 async API routers, 18 swappable plugins, hexagonal architecture enforced in CI', 'Six geospatial scoring engines (grid hotspot, city, pincode, catchment, rural, hybrid) plus a BFSI vertical on Mappls mGIS data, driven by versioned YAML weights', 'UniversalSchema: a single JSON contract for all outputs', 'Production on AWS (EC2, RDS, S3, Cognito, Verified Permissions multi-tenant RBAC, Secrets Manager) with nginx and a 4-stage GitLab CI pipeline backed by 20k LOC of tests', 'Key p90 latencies cut by an order of magnitude via percentile-driven profiling and single-flight caching'],
    },
    {
      id: 'footfall', title: 'Footfall Analysis LLM Agent Platform', cats: ['llm', 'geo'], status: 'ClarityX',
      summary: 'Production multi-agent system converting natural-language questions into business intelligence for location analytics.',
      stack: ['Mistral 7B', 'LLaMA 3 70B', 'PostGIS', 'Pydeck', 'Streamlit'],
      highlights: ['Intent Agent (Mistral 7B), SQL Generator (LLaMA 3 70B), Executor and Summarizer agents', '3-layer dimensional model (Search, Directions, Navigation) over 1M+ daily mobility records', 'Weighted intent formula validated against 60–80% actual visit probability', 'Schema-aware SQL generation with a 100+ test-case framework, reducing manual testing by 75%', '15–30 s latency for ~50 concurrent non-technical users'],
    },
    {
      id: 'search', title: 'LLM Semantic Search System', cats: ['llm', 'geo'], status: 'MapmyIndia',
      summary: 'Multilingual intent-based place search using LLMs integrated with MapmyIndia APIs.',
      stack: ['LLMs', 'Intent Classification', 'MapmyIndia APIs'],
      highlights: ['Improved place discovery accuracy by 35%', 'Natural-language queries with semantic understanding of user intent and contextual matching'],
    },
    {
      id: 'dms', title: 'Driver Monitoring System', cats: ['cv'], status: 'MapmyIndia',
      summary: 'Real-time detection of driver drowsiness and distraction, optimized for on-device edge processing.',
      stack: ['YOLO v7', 'PyTorch', 'Quantization', 'Edge AI'],
      highlights: ['97%+ accuracy with response times under 150 ms', 'Systematic hyperparameter tuning across YOLO variants against a real-time latency budget', 'Curated in-cabin datasets across lighting, head poses and occlusions; evaluated with precision, recall and mAP', 'Quantized for on-device processing, reducing cloud dependency'],
    },
    {
      id: 'face', title: 'Face Recognition & Verification', cats: ['cv'], status: 'MapmyIndia',
      summary: 'ArcFace-based driver identity verification for fleet systems, reliable in low-light in-vehicle conditions.',
      stack: ['ArcFace', 'PyTorch', 'FastAPI'],
      highlights: ['89%+ verification accuracy in low-light conditions', 'Tuned margin, scale and learning rate; calibrated the similarity threshold to balance false accepts and rejects', 'In production fleet management, 1000+ daily verifications'],
    },
    {
      id: 'microservices', title: 'AI Microservices Platform', cats: ['cv', 'platform'], status: 'MapmyIndia',
      summary: 'Scalable platform serving YOLO, ArcFace and Detectron2 models to multiple client applications.',
      stack: ['FastAPI', 'Docker', 'YOLO', 'ArcFace', 'Detectron2'],
      highlights: ['200+ concurrent requests with 94% uptime', 'Computer vision workloads across multiple client applications'],
    },
    {
      id: 'qgis', title: 'Geospatial AI Tools', cats: ['geo', 'cv'], status: 'MapmyIndia',
      summary: 'QGIS plugin with models for land-use classification, change detection and object recognition from satellite imagery.',
      stack: ['QGIS', 'Python', 'Satellite Imagery'],
      highlights: ['Improved geospatial data accuracy by 25%', 'Accelerated map data enrichment workflows'],
    },
    {
      id: '3d', title: '3D Building Automation', cats: ['geo', 'cv'], status: 'MapmyIndia',
      summary: 'Automated city-scale 3D building generation from aerial imagery and DEM data.',
      stack: ['Aerial Imagery', 'DEM', 'Python'],
      highlights: ['Reduced manual modeling effort by 65%', '40% model size reduction while maintaining visual quality'],
    },
    {
      id: 'mlops', title: 'MLOps & Deployment', cats: ['platform'], status: 'MapmyIndia',
      summary: 'Faster ML pipelines and automated release workflows for model deployment.',
      stack: ['Async APIs', 'Batching', 'CI/CD', 'Docker'],
      highlights: ['Asynchronous APIs and batching cut processing times by 50%', 'Automated CI/CD reduced release cycles by 40%'],
    },
    {
      id: 'tank', title: 'Tank Detection Model', cats: ['cv'], status: 'MapmyIndia',
      summary: 'YOLO v8 detection model optimized for challenging defense scenarios.',
      stack: ['YOLO v8', 'Data Augmentation'],
      highlights: ['94% precision and 92% recall', 'Augmentation strategies for varied terrain and lighting'],
    },
    {
      id: 'reid', title: 'ReID ArcFace Pipeline', cats: ['cv'], status: 'Open Source', repo: 'reid-arcface-pipeline',
      summary: 'Multi-object tracking that keeps identities stable through occlusions using appearance embeddings.',
      stack: ['Python', 'PyTorch', 'Ultralytics YOLO', 'Hungarian matching'],
      highlights: ['YOLO detection with class filtering and CPU fallback', '512-d L2-normalized appearance embeddings, batched', 'Cosine-similarity Hungarian matching with lost-track memory and re-identification'],
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
        : `<p class="modal-note">Built at ${p.status}; code is proprietary.</p>`}`;
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
    help: () => print(Object.keys(COMMANDS).map((k) => `<span class="k">${k}</span>`).join('  ')),
    whoami: () => print('Susheel Kumar Pandey: Senior Associate Technology Engineer @ ClarityX. AI, Geospatial Platforms &amp; GenAI. New Delhi.'),
    skills: () => print([
      '<span class="k">ai/ml</span>    YOLO v5/v7/v8 · ArcFace · Detectron2 · quantization · hyperparameter tuning',
      '<span class="k">genai</span>    Mistral 7B · LLaMA 3 70B · AWS Bedrock · Ollama · LangChain · multi-agent systems',
      '<span class="k">geo</span>      PostgreSQL · PostGIS · Redis · Pydeck · QGIS · geospatial scoring',
      '<span class="k">backend</span>  Python · FastAPI · Pydantic · Async SQLAlchemy · hexagonal architecture',
      '<span class="k">cloud</span>    AWS (EC2, RDS, S3, Cognito) · Docker · nginx · GitLab CI/CD · pytest',
    ].join('<br>')),
    projects: () => {
      print(PROJECTS.map((p) => `<span class="k">${p.id.padEnd(10, ' ').replace(/ /g, '&nbsp;')}</span>${esc(p.title)}`).join('<br>'));
      print('try: <span class="k">open atlas</span>', 'muted');
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
    experience: () => print('2026–now  Sr. Associate Technology Engineer @ ClarityX<br>2024–2026 Senior Software Engineer @ MapmyIndia<br>2022–2024 Software Engineer @ MapmyIndia<br>2021–2022 Trainee Engineer @ MapmyIndia<br>2021      B.Tech CSE, GLA University'),
    contact: () => print('<a href="mailto:susheel123pandey@gmail.com">susheel123pandey@gmail.com</a> · <a href="https://linkedin.com/in/susheel7860" target="_blank" rel="noopener">linkedin</a> · <a href="https://github.com/susheel7860" target="_blank" rel="noopener">github</a>'),
    github: () => { window.open('https://github.com/susheel7860', '_blank', 'noopener'); print('opening github.com/susheel7860 ↗'); },
    clear: () => { body.innerHTML = ''; },
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

  hints.innerHTML = ['whoami', 'skills', 'experience', 'projects', 'open atlas'].map((c) => `<button type="button">${c}</button>`).join('');
  hints.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) run(b.textContent); });

  // boot sequence: types `whoami` once, then waits for the visitor
  const boot = 'whoami';
  let i = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  print('Type <span class="k">help</span> or tap a command below.', 'muted');
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
