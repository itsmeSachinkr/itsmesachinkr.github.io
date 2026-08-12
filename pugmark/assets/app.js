/* ================= PUGMARK — shared app behaviour ================= */
/* Runs on every page: mobile nav, scroll reveal, back-to-top, active link, footer year. */

/* ---- Best-effort real photo loader ----
   Tier 1: pattern-guessed Wikimedia Commons URLs (data.js SPECIES_IMAGES /
   PARK_IMAGES) — free, instant, but unverified; many 404.
   Tier 2: if every guess 404s and the element carries a data-keyword, ask
   the Wikimedia Commons search API (from the visitor's own browser, with a
   localStorage cache) for a real, currently-existing photo instead of
   another guess — this is the "search the API" approach Commons itself
   documents for third-party sites, rather than raw file-name hotlinking.
   Either way, the illustration underneath is only replaced once an image
   actually finishes loading, so a bad guess or an offline visitor never
   shows a broken image — the existing art just stays put. */
const COMMONS_CACHE_PREFIX = 'pugmark_commons_v2_';
const COMMONS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function readCommonsCache(keyword){
  try{
    const raw = localStorage.getItem(COMMONS_CACHE_PREFIX + keyword);
    if(!raw) return undefined;
    const parsed = JSON.parse(raw);
    if(Date.now() - parsed.ts > COMMONS_CACHE_TTL_MS) return undefined;
    return parsed.value; // may be null, meaning "searched before, found nothing"
  } catch(e){ return undefined; }
}
function writeCommonsCache(keyword, value){
  try{ localStorage.setItem(COMMONS_CACHE_PREFIX + keyword, JSON.stringify({ts:Date.now(), value})); } catch(e){ /* storage disabled/full — skip caching */ }
}
/* Uses Wikipedia's "pageimages" API (not a raw Commons file search) --
   this is the standard, widely-documented way third-party sites pull a
   representative photo for a topic: search English Wikipedia for the
   keyword, then ask for that article's own lead/infobox image thumbnail.
   Far more reliable than guessing a Commons file name, since almost every
   species/park article that exists at all has a curated lead image. */
async function searchCommonsImage(keyword){
  const cached = readCommonsCache(keyword);
  if(cached !== undefined) return cached;
  let result = null;
  try{
    const api = 'https://en.wikipedia.org/w/api.php?action=query&generator=search'
      + '&gsrnamespace=0&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=640&format=json&origin=*'
      + '&gsrsearch=' + encodeURIComponent(keyword);
    const res = await fetch(api);
    if(res.ok){
      const data = await res.json();
      const pages = data && data.query && data.query.pages;
      const page = pages && Object.values(pages)[0];
      const thumb = page && page.thumbnail;
      if(thumb && thumb.source){
        result = { url: thumb.source, credit: 'Wikipedia' };
      }
    }
  } catch(e){ /* offline, blocked, or a malformed API response — fall through with no result */ }
  writeCommonsCache(keyword, result);
  return result;
}

function startPhotoLoad(img){
  if(img.dataset.hydrated) return;
  img.dataset.hydrated = '1';
  const urls = (img.dataset.urls || '').split(',').filter(Boolean);
  // Keywords are "||"-separated and tried in order — normally the park itself
  // first, then the specific wildlife it's famous for, so a park with no
  // Wikipedia photo of its own still gets a real photo of its famous animal.
  const keywords = (img.dataset.keyword || '').split('||').map(s=>s.trim()).filter(Boolean);
  const container = img.closest('.card-art, .detail-animal-wrap, .detail-hero, .potd-art') || img.parentElement;
  let i = 0;
  img.addEventListener('load', ()=> container.classList.add('has-photo'));
  async function trySearchFallback(){
    for(const kw of keywords){
      const result = await searchCommonsImage(kw);
      if(result && result.url){
        img.src = result.url;
        if(result.credit){
          const creditEl = container.querySelector('.photo-credit');
          if(creditEl) creditEl.textContent = `Photo via ${result.credit}`;
        }
        return;
      }
    }
  }
  function tryNext(){
    if(i >= urls.length){ trySearchFallback(); return; }
    img.src = urls[i++];
  }
  img.addEventListener('error', tryNext);
  tryNext();
}
/* Deferred until each image is about to scroll into view, so a 67-card grid
   doesn't fire dozens of simultaneous Commons API searches on page load. */
function hydratePhotos(scope){
  const els = (scope || document).querySelectorAll('img[data-urls], img[data-keyword]');
  if(!els.length) return;
  if('IntersectionObserver' in window){
    // Observe each img's visible container, not the img itself -- the img is
    // `display:none` until a photo loads, so it has no layout box and would
    // never be reported as intersecting anything.
    const targetToImg = new WeakMap();
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const img = targetToImg.get(entry.target);
          if(img) startPhotoLoad(img);
          io.unobserve(entry.target);
        }
      });
    }, {rootMargin: '200px'});
    els.forEach(img=>{
      const container = img.closest('.card-art, .detail-animal-wrap, .detail-hero, .potd-art') || img.parentElement;
      targetToImg.set(container, img);
      io.observe(container);
    });
  } else {
    els.forEach(startPhotoLoad);
  }
}
window.hydratePhotos = hydratePhotos;

(function(){
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');

  if(navToggle && header){
    navToggle.addEventListener('click', ()=>{
      const open = header.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.addEventListener('click', ()=> header.classList.remove('menu-open'));
    });
  }

  if(header){
    const onScroll = ()=> header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---- Surprise me: jump to a random park ---- */
  const surpriseBtn = document.getElementById('surpriseBtn');
  if(surpriseBtn && typeof ALL_PARKS !== 'undefined'){
    surpriseBtn.addEventListener('click', ()=>{
      surpriseBtn.classList.add('spin');
      const pick = ALL_PARKS[Math.floor(Math.random() * ALL_PARKS.length)];
      setTimeout(()=>{ location.href = `park.html?id=${encodeURIComponent(pick.id)}`; }, 260);
    });
  }

  /* ---- Active nav link ---- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(a=>{
    const target = a.getAttribute('href').split('/').pop();
    if(target === here) a.classList.add('active');
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold:0.12});
    revealEls.forEach(el=> io.observe(el));
    // Web-font swap-in can reflow the page after the observer's first check,
    // shifting elements across the fold — re-check once fonts settle.
    const recheckOnScreen = ()=>{
      revealEls.forEach(el=>{
        if(el.classList.contains('in')) return;
        const r = el.getBoundingClientRect();
        if(r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
      });
    };
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(recheckOnScreen);
    // Safety net: never leave content invisible if the observer misses an element.
    setTimeout(()=> revealEls.forEach(el=> el.classList.add('in')), 4000);
  } else {
    revealEls.forEach(el=> el.classList.add('in'));
  }

  /* ---- Card art: cursor-follow glow + icon parallax ----
     Delegated on document (rather than bound per .card-art) because the park
     cards are injected by site.js after this script runs. */
  (function(){
    let activeArt = null;
    function resetArt(art){
      if(!art) return;
      art.style.removeProperty('--mx');
      art.style.removeProperty('--my');
      const animal = art.querySelector('.card-animal');
      if(animal) animal.style.transform = '';
    }
    document.addEventListener('mousemove', (e)=>{
      const art = e.target.closest ? e.target.closest('.card-art') : null;
      if(art !== activeArt){ resetArt(activeArt); activeArt = art; }
      if(!art) return;
      const r = art.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      art.style.setProperty('--mx', `${(px*100).toFixed(1)}%`);
      art.style.setProperty('--my', `${(py*100).toFixed(1)}%`);
      const animal = art.querySelector('.card-animal');
      if(animal){
        const dx = (px - 0.5) * -10;
        const dy = (py - 0.5) * -6;
        animal.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(1.08)`;
      }
    });
  })();

  /* ---- Back to top ---- */
  const backBtn = document.getElementById('backToTop');
  if(backBtn){
    window.addEventListener('scroll', ()=>{
      backBtn.classList.toggle('show', window.scrollY > 500);
    }, {passive:true});
    backBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(el=> el.textContent = new Date().getFullYear());
})();
