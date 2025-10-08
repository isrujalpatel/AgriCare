// auth.js - demo client-side auth

document.addEventListener('DOMContentLoaded', ()=>{
  // Registration handler
  const reg = document.getElementById('registerForm');
  if(reg){
    reg.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const pass = document.getElementById('regPass').value;
      if(!email || !pass) return alert('Email & password required');
      const users = JSON.parse(localStorage.getItem('agri_users')||'{}');
      if(users[email]) return alert('Account exists — please login');
      users[email] = { name, email, pass };
      localStorage.setItem('agri_users', JSON.stringify(users));
      localStorage.setItem('agri_user', JSON.stringify({ email, name }));
      alert('Registered and logged in (demo).');
      location.href = '../index.html';
    });
  }

  // Login handler
  const lf = document.getElementById('loginForm');
  if(lf){
    lf.addEventListener('submit', e=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPass').value;
      const users = JSON.parse(localStorage.getItem('agri_users')||'{}');
      const u = users[email];
      if(!u || u.pass !== pass) return alert('Invalid credentials (demo).');
      localStorage.setItem('agri_user', JSON.stringify({ email, name: u.name }));
      alert('Logged in (demo).');
      location.href = '../index.html';
    });
  }

  // Update nav link if logged in
  const user = JSON.parse(localStorage.getItem('agri_user')||'null');
  if(user){
    document.querySelectorAll('.nav-link').forEach(a=>{
      if(a.getAttribute('href') && a.getAttribute('href').includes('login')) a.textContent = 'Account';
    });
  }
});