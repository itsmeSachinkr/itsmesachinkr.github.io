function toggleNav() {
  document.getElementById('nav-mobile').classList.toggle('open');
}

function toggleQA(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.qa-item.open').forEach(i => i.classList.remove('open'));
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
    timestamp: new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}),
    name, phone, email, org, city, state, type, message: msg
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });

  msgEl.textContent = '🎉 Thank you for reaching out! The EduKart team has received your message and will get in touch with you very soon. Stress-free book delivery is just around the corner!';
  msgEl.className = 'form-msg success';
  ['f-name','f-phone','f-email','f-org','f-city','f-msg'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-type').value = '';
  document.getElementById('f-state').value = '';
  btn.disabled = false;
  btn.textContent = 'Send Message →';
}
