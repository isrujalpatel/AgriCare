// orders.js - show user's orders
document.addEventListener('DOMContentLoaded', ()=>{
  const user = JSON.parse(localStorage.getItem('agri_user')||'null');
  const container = document.getElementById('ordersList');
  if(!user){ container.innerHTML = '<div>Please log in to view orders. <a href="auth/login.html">Login</a></div>'; return; }
  const orders = JSON.parse(localStorage.getItem('agri_orders')||'[]').filter(o=> o.user === user.email);
  if(orders.length===0) { container.innerHTML = '<div>You have no orders.</div>'; return; }
  container.innerHTML = orders.reverse().map(o => {
    const itemsHtml = o.items.map(i=>`<div style="display:flex;justify-content:space-between"><div>${i.name}</div><div>×${i.qty}</div></div>`).join('');
    return `<div style="padding:12px;margin-bottom:14px;background:rgba(255,255,255,0.94);border-radius:10px;box-shadow:0 6px 18px rgba(10,30,10,0.06)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div><strong>Order ${o.id}</strong><div style="font-size:13px;color:#666">${new Date(o.created_at).toLocaleString()}</div></div>
        <div style="font-weight:800;color:#0b5726">₹${o.total}</div>
      </div>
      <div style="margin-top:8px">Status: <strong>${o.status}</strong></div>
      <div style="margin-top:10px">${itemsHtml}</div>
      <div style="margin-top:10px"><button class="btn" onclick="alert('Order details:\\n\\nAddress: ${o.addr}\\nPhone: ${o.phone}')">View Details</button></div>
    </div>`;
  }).join('');
});
