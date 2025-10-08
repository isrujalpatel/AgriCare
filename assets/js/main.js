// main.js: load products, filters, render, require login for adding
let ALL = [];

async function loadPesticides(){
  const res = await fetch('assets/data/pesticides.json');
  ALL = await res.json();
  // expose for other scripts (cart.js expects window.ALL)
  window.ALL = ALL;
  initFilters();
  render(ALL);
  // updateHeaderCartCount is not defined in this project; ensure cart preview updates
  if(typeof updateHeaderCartCount === 'function') updateHeaderCartCount();
  if(typeof updateCartPreview === 'function') updateCartPreview();
}

function initFilters(){
  const crops = ['All', ...new Set(ALL.map(p=>p.crop))];
  document.getElementById('sideCropFilter').innerHTML = crops.map(c=>`<option value="${c}">${c}</option>`).join('');
  document.getElementById('sideSortBy').value = 'name';
  document.getElementById('sideCropFilter').addEventListener('change', applyFilters);
  document.getElementById('sideSortBy').addEventListener('change', applyFilters);
  document.getElementById('searchBox').addEventListener('input', applyFilters);
}

function applyFilters(){
  let items = [...ALL];
  const crop = document.getElementById('sideCropFilter').value;
  const sort = document.getElementById('sideSortBy').value;
  const q = (document.getElementById('searchBox').value||'').toLowerCase().trim();
  if(crop && crop!=='All') items = items.filter(i=>i.crop===crop);
  if(q) items = items.filter(i => (i.name + ' ' + (i.active_ingredient||'') + ' ' + i.category).toLowerCase().includes(q));
  if(sort==='price') items.sort((a,b)=>a.price-b.price); else items.sort((a,b)=>a.name.localeCompare(b.name));
  render(items);
}

function render(list){
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';
  list.forEach(p => {
    const discount = p.discount_percent || 30;
    const discounted = Math.round(p.price * (100 - discount)/100);
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <h4>${p.name}</h4>
        <p>${p.short}</p>
        <div class="price-row">
          <div>
            <div class="price-main">₹${discounted}<span class="old-price">₹${p.price}</span></div>
          </div>
          <div class="badge">${discount}% OFF</div>
        </div>
        <div style="margin-top:12px;display:flex;gap:10px;">
          <button class="btn" onclick="onAddToCart(${p.id})">Add to cart</button>
          <button class="btn ghost" onclick="viewDetails(${p.id})">Details</button>
        </div>
      </div>`;
    catalog.appendChild(card);
  });
}

function viewDetails(id){
  const p = ALL.find(x=>x.id===id);
  if(!p) return;
  alert(`${p.name}\n\nCrop: ${p.crop}\nCategory: ${p.category}\nActive: ${p.active_ingredient || 'N/A'}\n\n${p.short}\n\nPrice: ₹${p.price}`);
}

function onAddToCart(id){
  const user = JSON.parse(localStorage.getItem('agri_user')||'null');
  if(!user){ location.href = 'auth/login.html'; return; }
  addToCart(id);
  window.addToCart = addToCart;
}

// ensure the handler is available as a global for inline onclick handlers
window.onAddToCart = onAddToCart;

document.addEventListener('DOMContentLoaded', ()=> {
  loadPesticides();
  document.getElementById('openCartBtn').addEventListener('click', ()=> toggleCartDrawer(true));
  document.getElementById('openCartBtn2')?.addEventListener('click', ()=> toggleCartDrawer(true));
  document.getElementById('closeCartBtn')?.addEventListener('click', ()=> toggleCartDrawer(false));
});
