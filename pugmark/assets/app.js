/* ================= PUGMARK — shared app behaviour ================= */
/* Runs on every page: mobile nav, scroll reveal, back-to-top, active link, footer year. */

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
