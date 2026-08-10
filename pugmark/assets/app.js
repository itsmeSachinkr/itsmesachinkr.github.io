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
