// cart.js - store cart in localStorage under 'agri_cart'; drawer + cart page + checkout
function getCart(){ return JSON.parse(localStorage.getItem('agri_cart')||'[]'); }
function saveCart(c){ localStorage.setItem('agri_cart', JSON.stringify(c)); window.dispatchEvent(new Event('cartChanged')); }

function addToCart(id){
  const p = (window.ALL || []).find(x=>x.id===id);
  if(!p) return;
  const cart = getCart();
  const ex = cart.find(i=>i.id===id);
  if(ex) ex.qty++;
  else cart.push({ id:p.id, name:p.name, price:p.price, img:p.img, qty:1 });
  saveCart(cart);
  updateCartPreview();
  toggleCartDrawer(true);
}

function updateCartPreview(){
  const cart = getCart();
  const headerCount = document.getElementById('headerCartCount');
  if(headerCount) headerCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  const cartCountEl = document.getElementById('cartCount');
  if(cartCountEl) cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  const preview = document.getElementById('cartPreview');
    if(preview) preview.innerHTML = cart.length===0 ? '<div class="small">Cart is empty</div>' : cart.slice(0,4).map(it=>`<div style="padding:6px 0">${it.name} \u00d7 ${it.qty}</div>`).join('');
  const cartTotalEl = document.getElementById('cartTotal');
  if(cartTotalEl) cartTotalEl.textContent = cart.reduce((s,i)=> s + Math.round(i.price*0.7)*i.qty, 0);
}

function toggleCartDrawer(open){
  const d = document.getElementById('cartDrawer');
  if(!d) return; // no drawer on this page
  if(open){ d.classList.add('open'); renderDrawerItems(); }
  else d.classList.remove('open');
}

function renderDrawerItems(){
  const list = document.getElementById('cartItemsList');
  if(!list) return; // drawer not present on this page
  const cart = getCart();
  list.innerHTML = '';
  const drawerSubtotalEl = document.getElementById('drawerSubtotal');
  const drawerDeliveryEl = document.getElementById('drawerDelivery');
  if(cart.length===0){ list.innerHTML = '<div style="padding:18px">Cart is empty</div>'; if(drawerSubtotalEl) drawerSubtotalEl.innerText=0; if(drawerDeliveryEl) drawerDeliveryEl.innerText=0; return; }
  cart.forEach(it=>{
    const discounted = Math.round(it.price*0.7);
    const row = document.createElement('div'); row.className='drawer-item';
    row.innerHTML = `<img src="${it.img}"><div class="item-info"><div style="font-weight:700">${it.name}</div><div style="color:#556b57;margin-top:6px">₹${discounted} × ${it.qty} = ₹${discounted*it.qty}</div>
      <div class="qty-controls"><button class="btn ghost" onclick="changeQty(${it.id}, ${Math.max(1,it.qty-1)})">−</button><input type="number" value="${it.qty}" min="1" onchange="changeQty(${it.id}, this.value)"><button class="btn ghost" onclick="changeQty(${it.id}, ${it.qty+1})">+</button> <button class="btn ghost" onclick="removeFromCart(${it.id})">Remove</button></div></div>`;
    list.appendChild(row);
  });
  updateDrawerSubtotal();
}

function changeQty(id, qty){
  qty = Number(qty)||1;
  const cart = getCart();
  cart.forEach(i=>{ if(i.id===id) i.qty=Math.max(1,qty); });
  saveCart(cart);
  renderDrawerItems();
  updateCartPreview();
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
  renderDrawerItems();
  updateCartPreview();
}

function updateDrawerSubtotal(){
  const cart = getCart();
  const subtotal = cart.reduce((s,i)=> s + Math.round(i.price*0.7)*i.qty,0);
  const drawerSubtotalEl = document.getElementById('drawerSubtotal');
  const drawerDeliveryEl = document.getElementById('drawerDelivery');
  if(drawerSubtotalEl) drawerSubtotalEl.innerText = subtotal;
  if(drawerDeliveryEl) drawerDeliveryEl.innerText = 40;
}

document.addEventListener('cartChanged', ()=> { updateCartPreview(); renderDrawerItems(); });
document.addEventListener('DOMContentLoaded', ()=> { updateCartPreview(); renderDrawerItems(); });

// Cart page interactions (delivery & checkout)
document.addEventListener('DOMContentLoaded', ()=>{
  const area = document.getElementById('deliveryArea');
  if(area){
    const change = ()=> {
      const fee = Number(area.selectedOptions[0].dataset.fee || 0);
      const subtotal = getCart().reduce((s,i)=> s + Math.round(i.price*0.7)*i.qty,0);
      const subtotalEl = document.getElementById('cartPageSubtotal');
      const deliveryEl = document.getElementById('cartPageDelivery');
      const totalEl = document.getElementById('cartPageTotal');
      if(subtotalEl) subtotalEl.innerText = subtotal;
      if(deliveryEl) deliveryEl.innerText = fee;
      if(totalEl) totalEl.innerText = subtotal + fee;
    };
    area.addEventListener('change', change);
    change();
    const container = document.getElementById('cartPageItems');
    if(container){
      const cart = getCart();
      if(cart.length===0) container.innerHTML = '<div class="small">Cart is empty.</div>';
      else container.innerHTML = cart.map(it=>`<div style="padding:10px;background:rgba(255,255,255,0.9);border-radius:8px;margin-bottom:8px"><strong>${it.name}</strong><div>Qty: <input type="number" value="${it.qty}" min="1" onchange="changeQty(${it.id},this.value)"></div><div>Price each: ₹${Math.round(it.price*0.7)}</div></div>`).join('');
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm){
      checkoutForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('agri_user')||'null');
        if(!user){ alert('Please log in to checkout'); location.href='auth/login.html'; return; }
        const nameEl = document.getElementById('checkoutName');
        const phoneEl = document.getElementById('checkoutPhone');
        const addrEl = document.getElementById('checkoutAddr');
        const msgEl = document.getElementById('checkoutMessage');
        const setMessage = (text) => { if(msgEl) msgEl.textContent = text; else console.log(text); };
        const name = (nameEl && nameEl.value||'').trim();
        const phone = (phoneEl && phoneEl.value||'').trim();
        const addr = (addrEl && addrEl.value||'').trim();
        if(!name || !phone || !addr){ setMessage('Please fill all fields'); return; }
        if(!/^[0-9\s+\-]{6,15}$/.test(phone)){ setMessage('Enter a valid phone number'); return; }
        const cart = getCart();
        if(cart.length===0){ setMessage('Your cart is empty'); return; }
        const subtotal = cart.reduce((s,i)=> s + Math.round(i.price*0.7)*i.qty,0);
        const fee = area && area.selectedOptions && area.selectedOptions[0] ? Number(area.selectedOptions[0].dataset.fee || 0) : 0;
        const total = subtotal + fee;
        const orders = JSON.parse(localStorage.getItem('agri_orders')||'[]');
        const order = { id:Date.now().toString(), user: user.email, name, phone, addr, items:cart, subtotal, fee, total, status:'Pending', created_at:new Date().toISOString() };
        orders.push(order);
        localStorage.setItem('agri_orders', JSON.stringify(orders));
        // Try to open mail client with order summary (optional demo fallback)
        try{
          const body = encodeURIComponent(`Thank you for your order ${order.id}\nTotal: \u20b9${total}\n\nWe will contact you at ${phone} for delivery.`);
          window.open(`mailto:${user.email}?subject=Order%20${order.id}&body=${body}`, '_blank');
        }catch(_){ /* ignore */ }
        setMessage('Order placed (demo). Redirecting...');
        // clear cart and update UI
        localStorage.removeItem('agri_cart');
        window.dispatchEvent(new Event('cartChanged'));
        if(checkoutForm.reset) checkoutForm.reset();
        setTimeout(()=> location.href='orders.html', 900);
      });
    }
  }
});
window.addToCart = addToCart;
