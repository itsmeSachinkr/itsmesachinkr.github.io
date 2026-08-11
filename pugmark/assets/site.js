/* ================= PUGMARK — page-specific rendering ================= */
/* Loaded after data.js + app.js. Each init function is guarded by the
   presence of its page's marker element, so this one file can be
   included on every page without conflicts. */

/* Read each park's terrain from its own note/famousFor text so the card art and
   hero background feel like the actual place, not a generic rotating palette. */
const HABITAT_RULES = [
  [/mangrove/, 'mangrove'],
  [/desert|dune|arid/, 'desert'],
  [/himalay|alpine|snow leopard|trans-himalayan|cold desert|mountain|peak|hill fort|highest peak/, 'mountain'],
  [/grassland|meadow|savanna/, 'grassland'],
  [/rainforest|evergreen|western ghats|tropical/, 'rainforest'],
  [/wetland|marine|coral|lake|backwater|delta|river|floodplain|mudflat|estuary/, 'wetland'],
];
const HABITAT_LABEL = {
  mangrove: 'a tidal mangrove forest', desert: 'an arid desert landscape', mountain: 'high-altitude mountain terrain',
  grassland: 'open grassland', rainforest: 'dense tropical rainforest', wetland: 'a wetland and riverine landscape',
  forest: 'deciduous forest',
};
const HABITAT_GRADIENT = {
  mangrove: ['#1b4d3e','#2f7a5f'], desert: ['#8a6238','#c99a52'], mountain: ['#33475b','#6f8ba3'],
  grassland: ['#5c6b2e','#93a84a'], rainforest: ['#1c3d24','#3f7a4a'], wetland: ['#1e4a5c','#3f8aa3'],
  forest: ['#2A4E38','#3F6B4C'],
};
const HABITAT_PALE = {
  mangrove: '#E5F2EE', desert: '#F7EEDD', mountain: '#EDF1F5', grassland: '#F1F4E3',
  rainforest: '#E7F2E8', wetland: '#E6F1F5', forest: '#EAF1EC',
};
function habitatTheme(park){
  const text = `${park.note} ${park.famousFor}`.toLowerCase();
  for(const [pattern, theme] of HABITAT_RULES){
    if(pattern.test(text)) return theme;
  }
  return 'forest';
}
function cardArtGradient(park){
  const [a,b] = HABITAT_GRADIENT[habitatTheme(park)];
  return `linear-gradient(135deg, ${a}, ${b})`;
}
function stateAbbrev(state){
  return state.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase();
}

/* Match each park's "famous for" line to a wildlife icon for the card art and detail badge. */
const SPECIES_ICON_RULES = [
  [/lion/, 'lion'],
  [/snow leopard/, 'snowleopard'],
  [/clouded leopard|leopard/, 'leopard'],
  [/tiger/, 'tiger'],
  [/rhino/, 'rhino'],
  [/elephant/, 'elephant'],
  [/deer|barasingha|sangai|blackbuck|tahr|antelope|bustard/, 'deer'],
  [/hornbill|duck|bird|crane|stork/, 'bird'],
  [/macaque|loris|langur|gibbon|primate/, 'primate'],
  [/crocodile/, 'crocodile'],
];
function speciesIcon(famousFor){
  const text = famousFor.toLowerCase();
  for(const [pattern, icon] of SPECIES_ICON_RULES){
    if(pattern.test(text)) return icon;
  }
  return 'leaf';
}

function parkCardHTML(p, i){
  const zoneLine = p.detailed
    ? `<div class="card-loc" style="opacity:.7">${p.zones.filter(z=>z[1]==='core').length} core zone${p.zones.filter(z=>z[1]==='core').length===1?'':'s'} · ${p.zones.filter(z=>z[1]==='buffer').length} buffer zone${p.zones.filter(z=>z[1]==='buffer').length===1?'':'s'}</div>`
    : '';
  return `
    <a class="card reveal" href="park.html?id=${encodeURIComponent(p.id)}">
      <div class="card-art" style="background:${cardArtGradient(p)}">
        <div class="card-badge">${stateAbbrev(p.state)}</div>
        <svg class="card-animal" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-${speciesIcon(p.famousFor)}"/></svg>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="card-loc">${p.state}${p.district ? ' · ' + p.district : ''}</div>
        <div class="famous-chip"><svg class="paw"><use href="#starIcon"/></svg>${p.famousFor}</div>
        <div class="card-note">${p.note}</div>
        ${zoneLine}
        <div class="card-cta"><svg class="paw"><use href="#pawIcon"/></svg> ${p.detailed ? 'View field notes & check dates' : 'View field notes'} →</div>
      </div>
    </a>`;
}
function storyCardHTML(s){
  const linkedPark = ALL_PARKS.find(p => p.name === s.park);
  const icon = linkedPark ? speciesIcon(linkedPark.famousFor) : 'leaf';
  return `
    <a class="story-card reveal" href="story.html?id=${encodeURIComponent(s.id)}">
      <div class="story-tag"><svg class="paw" style="width:12px;height:12px"><use href="#icon-${icon}"/></svg>${s.park} · ${s.state}</div>
      <h3>${s.title}</h3>
      <div class="story-teaser">${s.teaser}</div>
      <div class="story-read">Read the story <span>→</span></div>
    </a>`;
}
/* Combine a park's existing data fields into a fuller, more descriptive paragraph
   than the single-line "note" alone — no facts beyond what's already in the data. */
function decapitalize(text){
  return text.charAt(0).toLowerCase() + text.slice(1);
}
function parkNarrative(p){
  const sentences = [p.note];
  let s2 = `${p.name} is best known for ${decapitalize(p.famousFor)}`;
  if(p.established) s2 += `, and has been under protection since ${p.established}`;
  s2 += '.';
  sentences.push(s2);
  if(p.area) sentences.push(`The park spans ${p.area}${p.district ? ` in ${p.district}` : ''}.`);
  sentences.push(`It sits within ${HABITAT_LABEL[habitatTheme(p)]}.`);
  sentences.push(`The nearest access point is ${p.nearest}.`);
  return sentences.join(' ');
}

function dayOfYear(d){
  const start = new Date(d.getFullYear(),0,0);
  return Math.floor((d - start) / 86400000);
}
function reobserveReveals(){
  const els = document.querySelectorAll('.reveal:not(.in)');
  if('IntersectionObserver' in window && els.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); } });
    }, {threshold:0.12});
    els.forEach(el=> io.observe(el));
    setTimeout(()=> els.forEach(el=> el.classList.add('in')), 4000);
  } else {
    els.forEach(el=> el.classList.add('in'));
  }
}

/* ================= HOME PAGE ================= */
(function initHome(){
  const statTotal = document.getElementById('statTotal');
  if(!statTotal) return;

  function countUp(el, target){
    const dur = 900;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1-p, 3)));
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  countUp(statTotal, ALL_PARKS.length);
  countUp(document.getElementById('statStates'), new Set(ALL_PARKS.map(p=>p.state)).size);
  countUp(document.getElementById('statStories'), STORIES.length);

  // Park of the day — deterministic by date, so it's the same all day for every visitor.
  const potdEl = document.getElementById('parkOfDay');
  if(potdEl){
    const idx = dayOfYear(new Date()) % ALL_PARKS.length;
    const p = ALL_PARKS[idx];
    potdEl.innerHTML = `
      <div class="potd-badge mono">Today's Pick</div>
      <div>
        <div class="potd-loc">${p.state}${p.district ? ' · ' + p.district : ''}</div>
        <h3>${p.name}</h3>
        <p>${p.famousFor} — ${p.note}</p>
      </div>
      <a class="btn btn-dark" href="park.html?id=${encodeURIComponent(p.id)}">View field notes →</a>`;
  }

  // Featured parks — a fixed curated set, falls back gracefully if an id is missing.
  const featuredIds = ['kaziranga','ranthambore','gir','tadoba','sundarbans','kanha'];
  const featuredGrid = document.getElementById('featuredGrid');
  if(featuredGrid){
    const featured = featuredIds.map(id => ALL_PARKS.find(p=>p.id===id)).filter(Boolean);
    featuredGrid.innerHTML = featured.map((p,i)=>parkCardHTML(p,i)).join('');
  }

  // Story preview — first three
  const storyPreview = document.getElementById('storyPreviewGrid');
  if(storyPreview){
    storyPreview.innerHTML = STORIES.slice(0,3).map(storyCardHTML).join('');
  }

  reobserveReveals();
})();

/* ================= PARKS DIRECTORY PAGE ================= */
(function initParksPage(){
  const grid = document.getElementById('parkGrid');
  if(!grid) return;

  const resultCount = document.getElementById('resultCount');
  const stateSelect = document.getElementById('stateSelect');
  const regionChipsEl = document.getElementById('regionChips');
  const searchInput = document.getElementById('searchInput');
  const params = new URLSearchParams(location.search);

  let activeRegion = params.get('region') && REGIONS.includes(params.get('region')) ? params.get('region') : 'All';
  let activeState = params.get('state') || 'all';

  function populateStateSelect(){
    const states = [...new Set(ALL_PARKS.map(p=>p.state))].sort();
    states.forEach(s=>{
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      if(s === activeState) opt.selected = true;
      stateSelect.appendChild(opt);
    });
  }
  function populateRegionChips(){
    REGIONS.forEach(r=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = r;
      if(r === activeRegion) btn.classList.add('active');
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.region-chips button').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        activeRegion = r;
        applyFilters();
      });
      regionChipsEl.appendChild(btn);
    });
  }
  function renderGrid(list){
    grid.innerHTML = list.map((p,i)=>parkCardHTML(p,i)).join('');
    resultCount.textContent = `${list.length} of ${ALL_PARKS.length} parks shown`;
    reobserveReveals();
  }
  function applyFilters(){
    const q = searchInput.value.trim().toLowerCase();
    const filtered = ALL_PARKS.filter(p=>{
      const regionMatch = activeRegion === 'All' || p.region === activeRegion;
      const stateMatch = activeState === 'all' || p.state === activeState;
      const text = `${p.name} ${p.state} ${p.famousFor} ${p.note}`.toLowerCase();
      const searchMatch = !q || text.includes(q);
      return regionMatch && stateMatch && searchMatch;
    });
    renderGrid(filtered);
  }

  populateStateSelect();
  populateRegionChips();
  if(params.get('q')) searchInput.value = params.get('q');
  stateSelect.addEventListener('change', ()=>{ activeState = stateSelect.value; applyFilters(); });
  searchInput.addEventListener('input', applyFilters);
  applyFilters();
})();

/* ================= PARK DETAIL PAGE ================= */
(function initParkDetail(){
  const root = document.getElementById('parkDetail');
  if(!root) return;

  const params = new URLSearchParams(location.search);
  const park = ALL_PARKS.find(p => p.id === params.get('id'));

  if(!park){
    root.innerHTML = `
      <section class="wrap not-found">
        <h1>Park not found</h1>
        <p>We couldn't find a park with that ID. It may have been renamed or removed.</p>
        <a class="btn btn-dark" href="parks.html">← Back to all parks</a>
      </section>`;
    document.title = 'Park not found — Pugmark';
    return;
  }

  document.title = `${park.name} — Pugmark`;
  document.getElementById('crumbCurrent').textContent = park.name;

  function fullAlmanac(profile){
    return PROFILES[profile].map((s,i)=>`<div class="m"><div class="bar s-${s}" title="${STATUS_META[s].label}"></div><div class="lbl">${MONTHS[i]}</div></div>`).join('');
  }
  function renderZoneGroups(park){
    const core = park.zones.filter(z=>z[1]==='core');
    const buffer = park.zones.filter(z=>z[1]==='buffer');
    let html = '';
    if(core.length){
      html += `<div class="zone-group"><div class="zone-group-title">Core zone <span class="count">(${core.length})</span></div><div class="zones">${core.map(([name],i)=>`<div class="zone-row"><span class="zone-code core">C${i+1}</span><span>${name}</span></div>`).join('')}</div></div>`;
    }
    if(buffer.length){
      html += `<div class="zone-group"><div class="zone-group-title">Buffer zone <span class="count">(${buffer.length})</span></div><div class="zones">${buffer.map(([name],i)=>`<div class="zone-row"><span class="zone-code buffer">B${i+1}</span><span>${name}</span></div>`).join('')}</div></div>`;
    }
    return html;
  }

  const detailedBlock = park.detailed ? `
      <div class="section-label"><svg class="paw"><use href="#pawIcon"/></svg> Safari zones — core &amp; buffer <span class="rule"></span></div>
      ${renderZoneGroups(park)}
      <div class="legend-zone">
        <div><span class="sw" style="background:var(--canopy)"></span>Core zone — strictly protected, limited permits, best sighting odds</div>
        <div><span class="sw" style="background:var(--ochre-deep)"></span>Buffer zone — surrounding forest, more flexible permits, often open longer</div>
      </div>
      ${park.zoneNote ? `<div class="zone-note">${park.zoneNote}</div>` : ''}
      <div style="height:26px"></div>
      <div class="section-label">Seasonal almanac <span class="rule"></span></div>
      <div class="almanac">
        <div class="almanac-strip">${fullAlmanac(park.profile)}</div>
        <div class="legend">${Object.entries(STATUS_META).map(([k,v])=>`<div><span class="dot" style="background:${v.dot}"></span>${v.label}</div>`).join('')}</div>
      </div>
      <div class="section-label">Check a date <span class="rule"></span></div>
      <div class="ledger">
        <div class="ledger-top">
          <div><label for="dateInput">Planned visit date</label><input type="date" id="dateInput"></div>
          <button class="check-btn" id="checkBtn" type="button">Check estimate</button>
        </div>
        <div class="stamp-result" id="stampResult"></div>
      </div>
    ` : `
      <div class="section-label">Best time to visit <span class="rule"></span></div>
      <div class="simple-note">${park.season || 'Season varies — check with the state forest department before travelling.'}</div>
      <div style="height:18px"></div>
      <div class="simple-note" style="border-style:dashed">Full core/buffer zone maps and a date-based availability estimate are available for Maharashtra and Madhya Pradesh parks. For ${park.name}, check current zones, permits and live availability directly with the ${park.state} Forest Department or the park's official booking counter.</div>
    `;

  const relatedStories = STORIES.filter(s => s.park === park.name);
  const relatedBlock = relatedStories.length ? `
      <div style="height:26px"></div>
      <div class="section-label">Field stories about this park <span class="rule"></span></div>
      <div class="related-strip">${relatedStories.map(s=>`<a href="story.html?id=${encodeURIComponent(s.id)}">${s.title} →</a>`).join('')}</div>
    ` : '';

  const icon = speciesIcon(park.famousFor);
  const theme = habitatTheme(park);
  const narrative = parkNarrative(park);

  const sameState = ALL_PARKS.filter(x => x.state === park.state && x.id !== park.id).slice(0,4);
  const sameStateBlock = sameState.length ? `
      <div style="height:30px"></div>
      <div class="section-label">More parks in ${park.state} <span class="rule"></span></div>
      <div class="related-strip">${sameState.map(x=>`<a href="park.html?id=${encodeURIComponent(x.id)}"><svg class="paw" style="width:12px;height:12px"><use href="#icon-${speciesIcon(x.famousFor)}"/></svg> ${x.name} →</a>`).join('')}</div>
    ` : '';

  root.innerHTML = `
    <section class="detail-hero" style="background:linear-gradient(180deg, ${HABITAT_PALE[theme]} 0%, var(--bg) 100%)">
      <svg class="detail-animal-bg" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-${icon}"/></svg>
      <div class="wrap detail-hero-row">
        <svg class="detail-animal" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-${icon}"/></svg>
        <div>
          <span class="badge mono">${park.state}</span>
          <h1>${park.name}</h1>
          <div class="loc">${park.district ? park.district + ' · ' : ''}Nearest access: ${park.nearest}</div>
        </div>
      </div>
    </section>
    <section class="detail-body wrap">
      <div class="famous-callout">
        <svg class="paw" style="width:20px;height:20px;color:var(--ochre-deep)"><use href="#starIcon"/></svg>
        <div><span class="fc-label">Famous for</span><span class="fc-value">${park.famousFor}</span></div>
      </div>
      <div class="meta-row">
        <div class="meta-item"><div class="k">Region</div><div class="v">${park.region}</div></div>
        ${park.established ? `<div class="meta-item"><div class="k">Established</div><div class="v">${park.established}</div></div>` : ''}
        ${park.area ? `<div class="meta-item"><div class="k">Area</div><div class="v">${park.area}</div></div>` : ''}
        <div class="meta-item"><div class="k">Zone Detail</div><div class="v">${park.detailed ? 'Full core/buffer maps' : 'Overview only'}</div></div>
      </div>
      <p class="desc">${narrative}</p>
      <a class="btn btn-dark reach-link" href="getting-there.html?park=${encodeURIComponent(park.id)}"><svg class="paw"><use href="#pawIcon"/></svg> How to reach ${park.name} →</a>
      ${detailedBlock}
      ${relatedBlock}
      ${sameStateBlock}
      <div style="height:10px"></div>
      <a class="btn btn-ghost" href="parks.html">← Back to all parks</a>
    </section>`;

  if(park.detailed){
    document.getElementById('checkBtn').addEventListener('click', ()=>checkAvailability(park));
  }
})();

/* ================= AVAILABILITY ESTIMATE (park detail page) ================= */
function checkAvailability(park){
  const dateVal = document.getElementById('dateInput').value;
  const resultBox = document.getElementById('stampResult');
  if(!dateVal){
    resultBox.className = 'stamp-result show';
    resultBox.innerHTML = `<div class="stamp-note" style="color:var(--rust)">Pick a date first.</div>`;
    return;
  }
  const d = new Date(dateVal + 'T00:00:00');
  const month = d.getMonth();
  let coreStatus = PROFILES[park.profile][month];
  const day = d.getDay();
  let bumpNote = '';
  if(coreStatus !== 'closed'){
    const isWeekend = (day === 0 || day === 6);
    const holidayWindow = (month === 11 && d.getDate() >= 20) || (month === 0 && d.getDate() <= 2);
    if(isWeekend || holidayWindow){
      const order = ['low','moderate','high','veryhigh'];
      const idx = order.indexOf(coreStatus);
      if(idx >= 0 && idx < order.length - 1){
        coreStatus = order[idx+1];
        bumpNote = isWeekend ? ' Weekend dates typically see extra demand.' : ' This falls in a holiday travel window — extra demand likely.';
      }
    }
  }
  const coreMeta = STATUS_META[coreStatus];
  const dateLabel = d.toLocaleDateString('en-IN', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

  let coreNote;
  if(coreStatus === 'closed'){
    coreNote = `Core zone safaris are typically suspended for the monsoon around this time.${bumpNote}`;
  } else if(coreStatus === 'veryhigh'){
    coreNote = `Peak season — this date usually books out weeks in advance, especially popular zones. Book as early as the portal allows.${bumpNote}`;
  } else if(coreStatus === 'high'){
    coreNote = `Strong demand expected. Booking 2–4 weeks ahead is a safe bet.${bumpNote}`;
  } else if(coreStatus === 'moderate'){
    coreNote = `Moderate demand. A week or two of lead time should be comfortable.${bumpNote}`;
  } else {
    coreNote = `Typically quieter season with easier availability — good time to book closer to the date.${bumpNote}`;
  }

  // Buffer zones follow a different rhythm from the core zone — often open through
  // monsoon closures and generally easier to get a permit for at the same time of year.
  const hasBuffer = park.zones.some(z => z[1] === 'buffer');
  let bufferDot, bufferLabel, bufferNote;
  if(!hasBuffer){
    bufferDot = '#9b8f76';
    bufferLabel = 'No formal buffer circuit';
    bufferNote = `${park.name} doesn't run a separate buffer-zone safari circuit — every permit here is for the core zone.`;
  } else if(coreStatus === 'closed'){
    bufferDot = STATUS_META.low.dot;
    bufferLabel = 'Typically open';
    bufferNote = `Buffer zones usually stay open through the monsoon even when the core zone closes — check the portal for buffer-zone slots.`;
  } else {
    bufferDot = coreMeta.dot;
    bufferLabel = coreMeta.label;
    bufferNote = `Buffer-zone permits are generally easier to get than core-zone ones at the same time of year.`;
  }

  resultBox.className = 'stamp-result show';
  resultBox.innerHTML = `
    <div class="stamp-card">
      <div class="stamp-watermark">Estimate</div>
      <div class="mono" style="font-size:0.78rem; color:var(--bark); margin-bottom:14px;">${dateLabel}</div>
      <div class="zone-status-row">
        <div class="zone-status-item">
          <div class="zone-status-head"><span class="dot" style="background:${coreMeta.dot}"></span><span class="zone-status-title">Core Zone</span></div>
          <div class="zone-status-value">${coreMeta.label}</div>
          <div class="stamp-note">${coreNote}</div>
        </div>
        <div class="zone-status-item">
          <div class="zone-status-head"><span class="dot" style="background:${bufferDot}"></span><span class="zone-status-title">Buffer Zone</span></div>
          <div class="zone-status-value">${bufferLabel}</div>
          <div class="stamp-note">${bufferNote}</div>
        </div>
      </div>
      <a class="book-btn" href="${park.portal}" target="_blank" rel="noopener">Check live seats &amp; book on official portal ↗</a>
      <div class="disclaimer-line">Based on general seasonal patterns, not live seat data. The official portal is the only source for confirmed availability.</div>
    </div>
  `;
}

/* ================= STORIES DIRECTORY PAGE ================= */
(function initStoriesPage(){
  const grid = document.getElementById('storyGrid');
  if(!grid) return;
  grid.innerHTML = STORIES.map(storyCardHTML).join('');
  reobserveReveals();
})();

/* ================= STORY DETAIL PAGE ================= */
(function initStoryDetail(){
  const root = document.getElementById('storyDetail');
  if(!root) return;

  const params = new URLSearchParams(location.search);
  const story = STORIES.find(s => s.id === params.get('id'));

  if(!story){
    root.innerHTML = `
      <section class="wrap not-found">
        <h1>Story not found</h1>
        <p>We couldn't find a field story with that ID.</p>
        <a class="btn btn-dark" href="stories.html">← Back to all stories</a>
      </section>`;
    document.title = 'Story not found — Pugmark';
    return;
  }

  document.title = `${story.title} — Pugmark`;
  document.getElementById('crumbCurrent').textContent = story.title;

  const linkedPark = ALL_PARKS.find(p => p.name === story.park);
  const parkLink = linkedPark ? `<a href="park.html?id=${encodeURIComponent(linkedPark.id)}">${story.park}</a>` : story.park;
  const icon = linkedPark ? speciesIcon(linkedPark.famousFor) : 'leaf';

  const more = STORIES.filter(s => s.id !== story.id).slice(0,3);

  root.innerHTML = `
    <section class="detail-hero">
      <svg class="detail-animal-bg" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-${icon}"/></svg>
      <div class="wrap detail-hero-row">
        <svg class="detail-animal" viewBox="0 0 100 100" aria-hidden="true"><use href="#icon-${icon}"/></svg>
        <div>
          <span class="badge mono">${story.state}</span>
          <h1>${story.title}</h1>
          <div class="loc">${parkLink} · ${story.state}</div>
        </div>
      </div>
    </section>
    <section class="detail-body wrap story-body">
      ${story.body.map(p=>`<p>${p}</p>`).join('')}
      <div style="height:10px"></div>
      <a class="btn btn-ghost" href="stories.html">← Back to all stories</a>
      ${more.length ? `
        <div style="height:40px"></div>
        <div class="section-label">More field stories <span class="rule"></span></div>
        <div class="story-grid">${more.map(storyCardHTML).join('')}</div>
      ` : ''}
    </section>`;

  reobserveReveals();
})();

/* ================= GETTING THERE PAGE ================= */
(function initGettingTherePage(){
  const destInput = document.getElementById('destInput');
  if(!destInput) return;

  const originInput = document.getElementById('originInput');
  const originList = document.getElementById('originList');
  const destList = document.getElementById('destList');
  const resultEl = document.getElementById('routeResult');
  const params = new URLSearchParams(location.search);

  // label "Park Name — State" -> park id, so the free-text field can resolve
  // back to the right park even though a datalist only stores plain strings.
  const parkByLabel = {};
  function labelFor(park){ return `${park.name} — ${park.state}`; }

  function populateOrigins(){
    ALL_CITIES.forEach(city=>{
      const opt = document.createElement('option');
      opt.value = city;
      originList.appendChild(opt);
    });
  }
  function populateDestinations(){
    ALL_PARKS.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(p=>{
      const label = labelFor(p);
      parkByLabel[label.toLowerCase()] = p;
      const opt = document.createElement('option');
      opt.value = label;
      destList.appendChild(opt);
    });
  }
  function findParkFromInput(){
    const typed = destInput.value.trim().toLowerCase();
    if(!typed) return null;
    if(parkByLabel[typed]) return parkByLabel[typed];
    // allow matching by park name alone (without the " — State" suffix)
    return ALL_PARKS.find(p => p.name.toLowerCase() === typed) || null;
  }
  function findOriginCity(){
    const typed = originInput.value.trim();
    if(!typed) return '';
    const curated = ORIGIN_CITIES.find(c => c.toLowerCase() === typed.toLowerCase());
    return curated || typed;
  }

  function routeStepHTML(icon, title, text){
    return `
      <div class="route-step">
        <div class="route-step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><use href="#icon-${icon}"/></svg></div>
        <div>
          <div class="route-step-title">${title}</div>
          <div class="route-step-text">${text}</div>
        </div>
      </div>`;
  }

  function renderRoute(){
    const originCity = findOriginCity();
    const park = findParkFromInput();

    if(!park){
      resultEl.innerHTML = `<div class="route-prompt">Select a park above to see how to reach it.</div>`;
      return;
    }

    const factRow = `
      <div class="route-fact-row">
        <div class="route-fact"><div class="k">Nearest Airport</div><div class="v">${park.access ? park.access.airport : 'Not yet documented'}</div></div>
        <div class="route-fact"><div class="k">Nearest Railway</div><div class="v">${park.access ? park.access.railway : 'Not yet documented'}</div></div>
      </div>`;
    const accessNote = park.access && park.access.note ? `<div class="route-note">${park.access.note}</div>` : '';

    if(!originCity){
      resultEl.innerHTML = `
        <div class="route-card">
          <div class="route-card-head"><h3>${park.name}</h3><div class="sub">${park.state}</div></div>
          <div class="route-card-body">
            ${factRow}
            ${accessNote}
            <div class="route-prompt">Select where you're travelling from above for a suggested route.</div>
          </div>
        </div>`;
      return;
    }

    let stepsHTML;
    if(park.hubCity && HUB_ROUTES[park.hubCity] && HUB_ROUTES[park.hubCity][originCity]){
      stepsHTML = routeStepHTML('plane', `${originCity} → ${park.hubCity}`, HUB_ROUTES[park.hubCity][originCity])
        + routeStepHTML('road', `${park.hubCity} → ${park.name}`, `From there, continue by road — nearest access is ${park.nearest}.`);
    } else {
      stepsHTML = routeStepHTML('plane', `${originCity} → nearest hub`, `Fly or take a train toward the nearest airport or railway station listed above, then arrange local road transport to the park.`)
        + routeStepHTML('road', `Reaching ${park.name}`, `Nearest access point: ${park.nearest}.`);
    }

    resultEl.innerHTML = `
      <div class="route-card">
        <div class="route-card-head"><h3>${originCity} → ${park.name}</h3><div class="sub">${park.state}</div></div>
        <div class="route-card-body">
          ${factRow}
          ${stepsHTML}
          ${accessNote}
        </div>
      </div>`;
  }

  populateOrigins();
  populateDestinations();
  const preselectId = params.get('park');
  if(preselectId){
    const match = ALL_PARKS.find(p => p.id === preselectId);
    if(match) destInput.value = labelFor(match);
  }
  originInput.addEventListener('input', renderRoute);
  destInput.addEventListener('input', renderRoute);
  renderRoute();
})();
