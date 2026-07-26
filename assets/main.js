document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initReveal();
  initCounters();
  initBackToTop();
});

function initNav() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('navPanel');

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        panel.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => io.observe(el));
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function toggleFAQ(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyupzTU1ya3fnOEiWjlvQ58nWxJMCevpCGU5CwCCHImm0unL-7R-p3f-Ea4p963QkQktA/exec';

async function submitForm() {
  const name = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const org = document.getElementById('f-org').value.trim();
  const city = document.getElementById('f-city').value.trim();
  const state = document.getElementById('f-state').value;
  const type = document.getElementById('f-type').value;
  const msg = document.getElementById('f-msg').value.trim();
  const msgEl = document.getElementById('form-msg');
  const btn = document.getElementById('submit-btn');

  msgEl.className = 'form-msg';
  if (!name || !phone || !email) {
    msgEl.textContent = 'Please fill in Name, Phone, and Email.';
    msgEl.className = 'form-msg error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  const payload = {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name, phone, email, org, city, state, type, message: msg
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  msgEl.textContent = '🎉 Thank you for reaching out! The EduKart team has received your message and will get in touch with you very soon. Stress-free book delivery is just around the corner!';
  msgEl.className = 'form-msg success';
  ['f-name', 'f-phone', 'f-email', 'f-org', 'f-city', 'f-msg'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-type').value = '';
  document.getElementById('f-state').value = '';
  btn.disabled = false;
  btn.textContent = 'Send Message →';
}
