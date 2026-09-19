// ═══════════════════════════════════════
// B-Fix Software | AI Store — Native App
// ═══════════════════════════════════════

const API = 'https://bfix-ai-store.vercel.app';
const $ = (s, p) => (p || document).querySelector(s);
const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
const app = $('#app');

let state = {
  customer: JSON.parse(localStorage.getItem('bfix-customer') || 'null'),
  categories: [], products: [], orders: [],
  promotions: [], cart: null,
};

// ─── API ───
async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  return res.json();
}

// ─── Router ───
let currentRoute = '';
function navigate(route, data) {
  currentRoute = route;
  window.scrollTo(0, 0);
  render(route, data);
}

// ─── Icons ───
const ICO = {
  home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  grid: '<path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v7H4zM13 14h7v7h-7z"/>',
  wallet: '<path d="M12 2v20M2 12h20M17 7l-5 5-5-5"/>',
  chat: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
  orders: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
};

function svgIcon(d, w = 20, h = 20) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
}

// ─── Render ───
function render(route, data) {
  const parts = route.split('/');
  const page = parts[0] || 'home';

  // Header
  const header = `
    <div class="header">
      <div class="header-inner">
        <div class="logo" onclick="navigate('home')">
          <img src="${API}/icons/icon-192.png" alt="B-Fix">
          <div>
            <div class="logo-text"><span class="gold">B-Fix</span> Software</div>
            <div class="text-xs text-t3">AI Store</div>
          </div>
        </div>
        <div class="header-actions">
          ${state.customer ? `<button class="hbtn" style="background:linear-gradient(135deg,#d4a017,#f5c542);color:#1a1200;border:none;font-weight:900;font-size:14px" onclick="navigate('profile')">${state.customer.name.charAt(0)}</button>` : `<button class="hbtn" onclick="navigate('login')">${svgIcon(ICO.user)}</button>`}
          <button class="hbtn" onclick="navigate('search')">${svgIcon(ICO.search)}</button>
        </div>
      </div>
    </div>`;

  // Bottom nav
  const navItems = [
    { route: 'home', label: 'الرئيسية', icon: ICO.home },
    { route: 'search', label: 'الخدمات', icon: ICO.grid },
    { route: 'topup', label: 'شحن', icon: ICO.wallet },
    { route: 'chat', label: 'دردشة', icon: ICO.chat },
    { route: 'orders', label: 'طلباتي', icon: ICO.orders },
  ];
  const bnav = `
    <div class="bnav"><div class="bnav-inner">
      ${navItems.map((n) => `
        <button class="bnav-item ${page === n.route ? 'active' : ''}" onclick="navigate('${n.route}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${page === n.route ? '2.5' : '1.8'}" stroke-linecap="round" stroke-linejoin="round"><path d="${n.icon}"/></svg>
          ${n.label}
        </button>`).join('')}
    </div></div>`;

  let content = '';
  switch (page) {
    case 'home': content = renderHome(); break;
    case 'search': content = renderSearch(data); break;
    case 'category': content = renderCategory(parts[1]); break;
    case 'product': content = renderProduct(parts[1]); break;
    case 'orders': content = renderOrders(); break;
    case 'topup': content = renderTopup(); break;
    case 'chat': content = renderChat(); break;
    case 'contact': content = renderContact(); break;
    case 'login': content = renderLogin(data); break;
    case 'register': content = renderRegister(); break;
    case 'profile': content = renderProfile(); break;
    default: content = renderHome();
  }

  app.innerHTML = header + `<div class="main fade">${content}</div>` + bnav;

  // Post-render hooks
  if (page === 'home') loadHome();
  if (page === 'search') loadSearch();
  if (page === 'category') loadCategory(parts[1]);
  if (page === 'product') loadProduct(parts[1]);
  if (page === 'orders') loadOrders();
  if (page === 'chat') loadChat();
}

// ─── Home ───
function renderHome() {
  return `
    <div class="hero">
      <div style="position:absolute;top:-40px;left:-40px;width:160px;height:160px;background:rgba(245,197,66,0.12);border-radius:50%;filter:blur(40px)"></div>
      <div style="position:relative">
        <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:99px;background:var(--s2);font-size:11px;font-weight:700;color:var(--gold);border:1px solid var(--b1)">
          <span style="width:6px;height:6px;border-radius:99px;background:var(--ok);animation:pulse 2s infinite"></span>خدمة فورية 24/7
        </span>
        <h1 style="margin-top:0.75rem">كل ما تحتاجه من <span class="gold" style="background:linear-gradient(120deg,#ffe58a,#f5c542,#d4a017);-webkit-background-clip:text;background-clip:text;color:transparent">أدوات</span> وخدمات رقمية</h1>
        <p>تفعيلات رسمية، اشتراكات موثوقة، شحن فوري</p>
        <div style="display:flex;gap:0.5rem;margin-top:1rem">
          <button class="btn btn-gold" style="width:auto" onclick="navigate('search')">تصفح الخدمات</button>
          <a href="https://wa.me/967777728478" target="_blank" class="btn btn-ghost" style="width:auto;text-decoration:none">تواصل معنا</a>
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><div class="stat-v">+5000</div><div class="stat-l">عميل</div></div>
      <div class="stat"><div class="stat-v">11</div><div class="stat-l">قسم</div></div>
      <div class="stat"><div class="stat-v">24/7</div><div class="stat-l">دعم فني</div></div>
    </div>
    <div class="sec-head"><span class="sec-title">الأقسام</span><span class="sec-link" onclick="navigate('search')">عرض الكل</span></div>
    <div class="cat-grid" id="cats">جاري التحميل...</div>
    <div class="sec-head mt-3"><span class="sec-title">الأكثر طلباً 🔥</span></div>
    <div id="featured">جاري التحميل...</div>
    <div class="scard mt-3">
      <h3 style="font-weight:900;margin-bottom:0.5rem">لماذا B-Fix Software؟</h3>
      <div style="color:var(--t2);font-size:13px">✅ تفعيلات رسمية 100%<br>⚡ تسليم فوري<br>🛡️ ضمان كامل<br>💬 دعم 24/7</div>
    </div>`;
}

async function loadHome() {
  try {
    const [cats, prods] = await Promise.all([api('/api/categories-safe'), api('/api/products')]);
    state.categories = Array.isArray(cats) ? cats : [];
    state.products = Array.isArray(prods) ? prods : [];
  } catch { state.categories = []; state.products = []; }

  const catsEl = $('#cats');
  if (catsEl && state.categories.length) {
    catsEl.innerHTML = state.categories.map((c) => `
      <div class="cat-item" onclick="navigate('category/${c.slug}')">
        <div class="cat-icon" style="background:linear-gradient(135deg,${c.gradient?.replace('from-','').replace('to-',',').replace(/-\d+/g,'') || '#f59e0b,#d97706'})">${c.icon}</div>
        <div class="cat-name">${c.name}</div>
      </div>`).join('');
  } else if (catsEl) {
    catsEl.innerHTML = state.products.reduce((acc, p) => {
      if (!acc.find(c => c.slug === p.categorySlug)) acc.push({ slug: p.categorySlug, name: p.categoryName, icon: p.icon, gradient: p.gradient });
      return acc;
    }, []).map((c) => `
      <div class="cat-item" onclick="navigate('category/${c.slug}')">
        <div class="cat-icon" style="background:linear-gradient(135deg,var(--gold),var(--gold2))">${c.icon}</div>
        <div class="cat-name">${c.name}</div>
      </div>`).join('');
  }

  const featEl = $('#featured');
  if (featEl) {
    const featured = state.products.filter((p) => p.badge || p.featured).slice(0, 6);
    featEl.innerHTML = featured.length ? featured.map(pcard).join('') : '<div class="card text-center text-t3">لا توجد خدمات مميزة</div>';
  }
}

// ─── Search ───
function renderSearch() {
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <h2 class="section-title">جميع الخدمات</h2>
    <input class="input mb-2" placeholder="ابحث: Unlock Tool, ChatGPT..." oninput="filterSearch(this.value)" id="search-input">
    <div class="flex gap-2 mb-2" style="overflow-x:auto;padding-bottom:4px" id="search-cats"></div>
    <div id="search-results">جاري التحميل...</div>`;
}

let searchCat = '';
async function loadSearch() {
  if (!state.products.length) {
    try { state.products = await api('/api/products'); } catch { state.products = []; }
  }
  renderSearchCats();
  filterSearch('');
}

function renderSearchCats() {
  const cats = [...new Map(state.products.map(p => [p.categorySlug, { slug: p.categorySlug, name: p.categoryName, icon: p.icon }])).values()];
  const el = $('#search-cats');
  if (!el) return;
  el.innerHTML = `<button class="btn ${!searchCat ? 'btn-gold' : 'btn-ghost'}" style="width:auto;padding:6px 14px;font-size:12px;flex-shrink:0" onclick="searchCat='';filterSearch($('#search-input').value||'')">الكل</button>` +
    cats.map(c => `<button class="btn ${searchCat === c.slug ? 'btn-gold' : 'btn-ghost'}" style="width:auto;padding:6px 14px;font-size:12px;flex-shrink:0" onclick="searchCat='${c.slug}';filterSearch($('#search-input').value||'')">${c.icon} ${c.name}</button>`).join('');
}

function filterSearch(q) {
  q = q.trim().toLowerCase();
  const list = state.products.filter(p =>
    (!searchCat || p.categorySlug === searchCat) &&
    (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q))
  );
  const el = $('#search-results');
  if (!el) return;
  el.innerHTML = `<div class="text-xs text-t3 mb-2">${list.length} خدمة</div>` +
    (list.length ? list.map(pcard).join('') : '<div class="card text-center text-t3">لا توجد نتائج</div>');
}

// ─── Category ───
function renderCategory(slug) {
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <div id="cat-banner"></div>
    <div id="cat-products">جاري التحميل...</div>`;
}

async function loadCategory(slug) {
  if (!state.products.length) {
    try { state.products = await api('/api/products'); } catch { state.products = []; }
  }
  const items = state.products.filter(p => p.categorySlug === slug);
  const cat = items[0];
  if (!cat) { $('#cat-products').innerHTML = '<div class="card text-center">القسم غير موجود</div>'; return; }

  $('#cat-banner').innerHTML = `
    <div class="hbanner mb-3" style="background:linear-gradient(135deg,${cat.gradient?.replace('from-','').replace('to-',',').replace(/-\d+/g,'') || '#f59e0b,#d97706'})">
      <div style="font-size:36px">${cat.icon}</div>
      <h2 style="font-size:22px;font-weight:900;margin-top:0.5rem">${cat.categoryName}</h2>
    </div>`;
  $('#cat-products').innerHTML = items.map(pcard).join('');
}

// ─── Product ───
function renderProduct(id) {
  return `
    <button class="back" onclick="history.back()">← رجوع</button>
    <div id="product-detail">جاري التحميل...</div>
    <div id="product-order" class="mt-2"></div>`;
}

async function loadProduct(id) {
  let p;
  try { p = await api(`/api/products/${id}`); } catch { p = null; }
  if (!p || p.error) { $('#product-detail').innerHTML = '<div class="card text-center">المنتج غير موجود</div>'; return; }

  const opts = p.options || [];
  const minPrice = opts.length ? Math.min(...opts.map(o => Number(o.price))) : Number(p.price);

  $('#product-detail').innerHTML = `
    <div class="scard">
      ${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%;border-radius:var(--r2);margin-bottom:0.75rem" alt="${p.name}">` : `<div class="pcard-icon" style="width:64px;height:64px;font-size:32px;margin-bottom:0.75rem">${p.icon}</div>`}
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      <h1 style="font-size:20px;font-weight:900;margin-top:0.5rem">${p.name}</h1>
      <p style="font-size:13px;color:var(--t2);margin-top:0.5rem">${p.description}</p>
      ${p.details ? `<div style="margin-top:0.75rem;padding:0.75rem;background:var(--s2);border-radius:var(--r1);font-size:13px;color:var(--t2);white-space:pre-line">${p.details}</div>` : ''}
      <div style="margin-top:0.75rem;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid var(--b1);padding-top:0.75rem">
        <div>
          <div class="text-xs text-t3">${opts.length ? 'يبدأ من' : 'السعر'}</div>
          <div style="font-size:28px;font-weight:900;color:var(--gold)">$${minPrice.toLocaleString()}</div>
        </div>
        <div class="text-xs text-t3">⚡ تسليم فوري<br>🛡️ ضمان كامل</div>
      </div>
    </div>`;

  // Order form
  let selectedOpt = opts[0]?.id || null;
  let qty = 1;

  function renderOrderForm() {
    const unitPrice = Number((opts.find(o => o.id === selectedOpt)?.price) || p.price);
    const total = unitPrice * qty;

    let html = '<div class="card">';
    html += '<h3 style="font-weight:900;margin-bottom:0.75rem">اطلب الآن</h3>';

    if (opts.length) {
      html += '<div class="text-xs text-t3 mb-1">اختر المدة / الباقة</div><div class="opt-grid mb-2">';
      opts.forEach(o => {
        html += `<div class="opt ${o.id === selectedOpt ? 'sel' : ''}" onclick="selectedOpt=${o.id};renderOrderForm2()">${o.name}<div style="font-size:11px;opacity:0.8">$${Number(o.price)}</div></div>`;
      });
      html += '</div>';
    }

    html += `<div class="qty-row mb-2">
      <span>الكمية</span>
      <div class="qty-btns">
        <button class="qty-btn" onclick="qty=Math.max(1,qty-1);renderOrderForm2()">−</button>
        <span style="font-weight:900;width:24px;text-align:center">${qty}</span>
        <button class="qty-btn" onclick="qty=Math.min(100,qty+1);renderOrderForm2()">+</button>
      </div>
    </div>`;

    if (p.requiredInfo) {
      html += `<div class="text-xs text-gold mb-1">📝 مطلوب: ${p.requiredInfo}</div>`;
      html += `<textarea class="input mb-2" id="cust-input" rows="2" placeholder="${p.requiredInfo}"></textarea>`;
    }

    html += `<button class="btn btn-gold" onclick="submitOrder(${p.id},${selectedOpt},${qty},${total},'${p.requiredInfo || ''}')">
      اختيار طريقة الدفع — $${total.toLocaleString()}
    </button>`;
    html += '</div>';

    $('#product-order').innerHTML = html;
  }

  window.renderOrderForm2 = renderOrderForm;
  window.selectedOpt = selectedOpt;
  window.qty = qty;
  window.submitOrder = submitOrder;

  renderOrderForm();
}

async function submitOrder(productId, optionId, qty, total, reqInfo) {
  if (!state.customer) { navigate('login'); return; }
  const custInput = $('#cust-input')?.value || '';

  // Show payment method selection
  const methods = [
    { id: 'jawaly', name: 'محفظة جيب', icon: '📱', num: '777728478' },
    { id: 'onecash', name: 'محفظة وان كاش', icon: '📱', num: '777728478' },
    { id: 'bank_karimi_usd', name: 'بنك الكريمي — دولار', icon: '🏦', num: '3211501129' },
    { id: 'bank_karimi_sar', name: 'بنك الكريمي — ريال سعودي', icon: '🏦', num: '3178533238' },
    { id: 'bank_karimi_yer', name: 'بنك الكريمي — يمني', icon: '🏦', num: '3211440658' },
    { id: 'mastercard', name: 'مستر كارد', icon: '💳', num: '5262160051739815' },
  ];

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-content scale-in">
    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
    <h2 style="font-size:18px;font-weight:900;margin-bottom:0.75rem">اختر طريقة الدفع</h2>
    <div class="pay-list">
      ${methods.map(m => `<div class="pay-item" onclick="confirmPay('${m.id}','${m.name}','${m.num}',${productId},${optionId},${qty},${total},'${custInput.replace(/'/g,"\\'")}')">
        <span class="pay-icon">${m.icon}</span>
        <div><div class="pay-name">${m.name}</div><div class="pay-num">${m.num}</div></div>
      </div>`).join('')}
    </div>
  </div>`;
  document.body.appendChild(overlay);
}

window.confirmPay = async function(methodId, methodName, methodNum, productId, optionId, qty, total, custInput) {
  document.querySelector('.modal-overlay')?.remove();

  // Show confirm with account details
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-content scale-in">
    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
    <h2 style="font-size:16px;font-weight:900;margin-bottom:0.75rem">تأكيد الدفع</h2>
    <div class="scard mb-2">
      <div style="font-size:24px;margin-bottom:0.5rem">${methodName.split(' ')[0]}</div>
      <div style="font-size:11px;color:var(--t3)">حوّل المبلغ إلى:</div>
      <div style="font-family:monospace;font-size:20px;font-weight:900;color:var(--gold);direction:ltr;margin:0.5rem 0">${methodNum}</div>
      <button class="btn btn-ghost" style="padding:6px" onclick="navigator.clipboard?.writeText('${methodNum}')">📋 نسخ الرقم</button>
    </div>
    <div style="font-size:13px;color:var(--t2);margin-bottom:0.75rem">
      المبلغ: <span style="font-weight:900;color:var(--gold)">$${total}</span>
    </div>
    <button class="btn btn-gold" onclick="doOrder(${productId},${optionId},${qty},'${methodId}','${custInput.replace(/'/g,"\\'")}')">
      شراء — $${total}
    </button>
  </div>`;
  document.body.appendChild(overlay);
};

window.doOrder = async function(productId, optionId, qty, payMethod, custInput) {
  document.querySelector('.modal-overlay')?.remove();
  try {
    const res = await api('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        productId, optionId: optionId || null, quantity: qty,
        customerName: state.customer.name, phone: state.customer.phone,
        email: state.customer.email, paymentMethod: payMethod,
        customerInput: custInput || null,
      }),
    });
    if (res.error) throw new Error(res.error);
    const o = res.order;

    // Success
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content scale-in" style="text-align:center">
      <div class="success-icon">🎉</div>
      <h2 style="font-size:20px;font-weight:900">تم إنشاء الطلب</h2>
      <div class="success-code">${o.code}</div>
      <p class="success-text">أرسل إثبات الدفع للإدارة عبر واتساب</p>
      <a href="https://wa.me/967777728478?text=${encodeURIComponent('طلب جديد: ' + o.code + ' | المبلغ: $' + o.total)}" target="_blank" class="btn btn-green mt-2" style="text-decoration:none">💬 إرسال عبر واتساب</a>
      <button class="btn btn-ghost mt-2" onclick="document.querySelector('.modal-overlay').remove();navigate('orders')">عرض طلباتي</button>
    </div>`;
    document.body.appendChild(overlay);

    // Save to local orders
    const saved = JSON.parse(localStorage.getItem('bfix-orders') || '[]');
    saved.unshift({ id: o.id, code: o.code, productName: o.productName, qty: o.quantity, total: o.total, date: Date.now() });
    localStorage.setItem('bfix-orders', JSON.stringify(saved.slice(0, 50)));
  } catch (err) {
    alert(err.message || 'حدث خطأ');
  }
};

// ─── Orders ───
function renderOrders() {
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <h2 class="section-title">طلباتي</h2>
    <div id="my-orders">جاري التحميل...</div>`;
}

function loadOrders() {
  const saved = JSON.parse(localStorage.getItem('bfix-orders') || '[]');
  const el = $('#my-orders');
  if (!el) return;
  if (!saved.length) {
    el.innerHTML = '<div class="card text-center"><div style="font-size:40px">🧾</div><p class="text-t2 mt-1">لا توجد طلبات</p><button class="btn btn-gold mt-2" onclick="navigate(\'search\')">تصفح الخدمات</button></div>';
    return;
  }
  el.innerHTML = saved.map(o => `
    <div class="card">
      <div class="order-item">
        <div>
          <div style="font-weight:800">${o.productName}</div>
          <div class="text-xs text-t3">${o.code || '#'+o.id} · ×${o.qty} · ${new Date(o.date).toLocaleDateString('ar')}</div>
        </div>
        <div style="font-weight:900;color:var(--gold)">$${Number(o.total).toLocaleString()}</div>
      </div>
    </div>`).join('');
}

// ─── Topup ───
function renderTopup() {
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <h2 class="section-title">شحن الرصيد</h2>
    ${state.customer ? `<div class="balance-box"><div class="balance-label">رصيدك الحالي</div><div class="balance-amount">$${state.customer.balance?.toLocaleString() || '0'}</div></div>
    <div class="card">
      <label class="text-xs text-t2" style="display:block;margin-bottom:4px">المبلغ بالدولار</label>
      <input class="input" type="number" id="topup-amount" min="1" placeholder="مثال: 50" dir="ltr" style="text-align:center;font-size:20px;font-weight:900">
      <button class="btn btn-gold mt-2" onclick="startTopup()">متابعة</button>
    </div>` : '<div class="card text-center"><div style="font-size:40px">👤</div><p class="text-t2 mt-1">سجّل دخولك لشحن الرصيد</p><button class="btn btn-gold mt-2" onclick="navigate(\'login\')">تسجيل الدخول</button></div>'}`;
}

window.startTopup = function() {
  const amount = Number($('#topup-amount')?.value);
  if (!amount || amount < 1) return alert('يرجى إدخال مبلغ صحيح');

  const methods = [
    { id: 'jawaly', name: 'محفظة جيب', icon: '📱', num: '777728478' },
    { id: 'onecash', name: 'محفظة وان كاش', icon: '📱', num: '777728478' },
    { id: 'bank_karimi_usd', name: 'بنك الكريمي — دولار', icon: '🏦', num: '3211501129' },
    { id: 'bank_karimi_sar', name: 'بنك الكريمي — ريال سعودي', icon: '🏦', num: '3178533238' },
    { id: 'bank_karimi_yer', name: 'بنك الكريمي — يمني', icon: '🏦', num: '3211440658' },
    { id: 'mastercard', name: 'مستر كارد', icon: '💳', num: '5262160051739815' },
  ];

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-content scale-in">
    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">✕</button>
    <h2 style="font-size:18px;font-weight:900;margin-bottom:0.5rem">شحن $${amount}</h2>
    <p class="text-sm text-t2 mb-2">اختر طريقة الدفع:</p>
    <div class="pay-list">
      ${methods.map(m => `<div class="pay-item" onclick="doTopup(${amount},'${m.id}','${m.name}','${m.num}')">
        <span class="pay-icon">${m.icon}</span>
        <div><div class="pay-name">${m.name}</div><div class="pay-num">${m.num}</div></div>
      </div>`).join('')}
    </div>
  </div>`;
  document.body.appendChild(overlay);
};

window.doTopup = async function(amount, methodId, methodName, methodNum) {
  document.querySelector('.modal-overlay')?.remove();

  const res = await api('/api/topup', {
    method: 'POST',
    body: JSON.stringify({ customerId: state.customer.id, amount, paymentMethod: methodId }),
  });
  if (res.error) return alert(res.error);

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-content scale-in" style="text-align:center">
    <div class="success-icon">✅</div>
    <h2 style="font-size:18px;font-weight:900">تم إرسال طلب الشحن</h2>
    <div class="success-code">${res.request.code}</div>
    <p class="success-text">حوّل <span style="color:var(--gold);font-weight:900">$${amount}</span> إلى:<br><span style="font-family:monospace;font-size:18px;color:var(--gold);font-weight:900">${methodNum}</span></p>
    <a href="https://wa.me/967777728478?text=${encodeURIComponent('طلب شحن: $' + amount + ' | ' + methodName + ' | حساب: ' + state.customer.phone)}" target="_blank" class="btn btn-green mt-2" style="text-decoration:none">💬 إرسال عبر واتساب</a>
    <button class="btn btn-ghost mt-2" onclick="document.querySelector('.modal-overlay').remove();navigate('home')">العودة للرئيسية</button>
  </div>`;
  document.body.appendChild(overlay);
};

// ─── Chat ───
function renderChat() {
  if (!state.customer) return '<div class="card text-center"><div style="font-size:40px">💬</div><p class="text-t2 mt-1">سجّل دخولك للمحادثة</p><button class="btn btn-gold mt-2" onclick="navigate(\'login\')">تسجيل الدخول</button></div>';
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <h2 class="section-title">💬 الدردشة مع الإدارة</h2>
    <div class="chat-box">
      <div class="chat-msgs" id="chat-msgs"><div class="text-center text-t3" style="padding:2rem">جاري التحميل...</div></div>
      <div class="chat-input">
        <input class="input" id="chat-text" placeholder="اكتب رسالتك..." onkeydown="if(event.key==='Enter'){event.preventDefault();sendChatMsg()}">
        <button class="btn btn-gold" style="width:auto;padding:0.75rem 1rem" onclick="sendChatMsg()">إرسال</button>
      </div>
    </div>`;
}

let chatInterval;
async function loadChat() {
  if (!state.customer) return;
  clearInterval(chatInterval);

  async function fetchMsgs() {
    try {
      const msgs = await api(`/api/messages/${state.customer.id}`);
      const el = $('#chat-msgs');
      if (!el) { clearInterval(chatInterval); return; }
      el.innerHTML = msgs.map(m => `
        <div class="msg ${m.sender === 'customer' ? 'msg-me' : 'msg-admin'}">
          ${m.content}
          <div class="msg-time">${new Date(m.createdAt).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>`).join('') || '<div class="text-center text-t3" style="padding:2rem">ابدأ محادثة 👋</div>';
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  fetchMsgs();
  chatInterval = setInterval(fetchMsgs, 3000);
}

window.sendChatMsg = async function() {
  const input = $('#chat-text');
  if (!input || !input.value.trim()) return;
  await api(`/api/messages/${state.customer.id}/send`, {
    method: 'POST',
    body: JSON.stringify({ sender: 'customer', content: input.value }),
  });
  input.value = '';
  loadChat();
};

// ─── Contact ───
function renderContact() {
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <h2 class="section-title">تواصل معنا</h2>
    <div class="card text-center"><div style="font-size:48px">🤝</div><p class="text-t2 mt-1">فريقنا متاح 24/7</p></div>
    <a href="https://wa.me/967777728478" target="_blank" class="card" style="display:flex;align-items:center;gap:12px;background:#25D366;color:#000;text-decoration:none">
      <span style="font-size:24px">💬</span><div style="font-weight:900">واتساب</div><div class="text-xs" style="opacity:0.7;margin-right:auto">+967 777 728 478</div><span>←</span>
    </a>
    <a href="https://t.me/bfixSoftware" target="_blank" class="card" style="display:flex;align-items:center;gap:12px;background:#229ED9;color:#fff;text-decoration:none">
      <span style="font-size:24px">✈️</span><div style="font-weight:900">تليجرام</div><div class="text-xs" style="opacity:0.7;margin-right:auto">@bfixSoftware</div><span>←</span>
    </a>
    <a href="https://www.facebook.com/share/1BbyBGMfL2/" target="_blank" class="card" style="display:flex;align-items:center;gap:12px;background:#1877F2;color:#fff;text-decoration:none">
      <span style="font-size:24px">📘</span><div style="font-weight:900">فيسبوك</div><div class="text-xs" style="opacity:0.7;margin-right-auto">صفحتنا</div><span>←</span>
    </a>`;
}

// ─── Login ───
function renderLogin(error) {
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <div class="card" style="max-width:380px;margin:0 auto">
      <div style="text-align:center;margin-bottom:1rem">
        <div style="width:56px;height:56px;border-radius:99px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto;box-shadow:0 8px 30px rgba(99,102,241,0.3)">👤</div>
        <h2 style="font-size:20px;font-weight:900;margin-top:0.75rem">تسجيل الدخول</h2>
      </div>
      ${error ? `<p style="font-size:13px;font-weight:700;color:var(--err);text-align:center;margin-bottom:0.75rem">${error}</p>` : ''}
      <input class="input mb-2" type="tel" id="login-phone" placeholder="رقم الهاتف *" dir="ltr" style="text-align:right" autofocus>
      <input class="input mb-2" type="password" id="login-pass" placeholder="كلمة المرور *">
      <button class="btn btn-gold mb-2" onclick="doLogin()">دخول</button>
      <div class="grid-2">
        <button class="btn btn-ghost" onclick="navigate('register')">حساب جديد</button>
        <button class="btn btn-ghost" onclick="doForgot()">نسيت كلمة المرور</button>
      </div>
    </div>`;
}

window.doLogin = async function() {
  const phone = $('#login-phone')?.value?.trim();
  const password = $('#login-pass')?.value;
  if (!phone || !password) return alert('يرجى إدخال الرقم وكلمة المرور');
  try {
    const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) });
    if (res.error) throw new Error(res.error);
    state.customer = res.customer;
    localStorage.setItem('bfix-customer', JSON.stringify(res.customer));
    navigate('home');
  } catch (err) { navigate('login', err.message); }
};

window.doForgot = function() {
  const phone = prompt('أدخل رقم الهاتف:');
  const newPass = prompt('كلمة المرور الجديدة (6 أحرف على الأقل):');
  if (!phone || !newPass || newPass.length < 6) return alert('يرجى إدخال البيانات بشكل صحيح');
  api('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ phone, newPassword: newPass }) })
    .then(r => { if (r.error) throw new Error(r.error); alert('تم إعادة التعيين — يمكنك تسجيل الدخول الآن'); })
    .catch(e => alert(e.message));
};

// ─── Register ───
function renderRegister() {
  return `
    <button class="back" onclick="navigate('login')">← رجوع</button>
    <div class="card" style="max-width:380px;margin:0 auto">
      <div style="text-align:center;margin-bottom:1rem">
        <div style="width:56px;height:56px;border-radius:99px;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto;box-shadow:0 8px 30px rgba(34,197,94,0.3)">📝</div>
        <h2 style="font-size:20px;font-weight:900;margin-top:0.75rem">إنشاء حساب جديد</h2>
      </div>
      <input class="input mb-2" id="reg-name" placeholder="الاسم الكامل *">
      <input class="input mb-2" type="tel" id="reg-phone" placeholder="+967 7xx xxx xxx *" dir="ltr" style="text-align:right">
      <input class="input mb-2" type="email" id="reg-email" placeholder="البريد الإلكتروني" dir="ltr" style="text-align:right">
      <input class="input mb-2" type="password" id="reg-pass" placeholder="كلمة المرور (6 أحرف) *">
      <input class="input mb-2" type="password" id="reg-confirm" placeholder="تأكيد كلمة المرور *">
      <button class="btn btn-gold mb-2" onclick="doRegister()">إنشاء الحساب</button>
      <button class="btn btn-ghost" onclick="navigate('login')">لدي حساب — تسجيل الدخول</button>
    </div>`;
}

window.doRegister = async function() {
  const name = $('#reg-name')?.value?.trim();
  const phone = $('#reg-phone')?.value?.trim();
  const email = $('#reg-email')?.value?.trim();
  const pass = $('#reg-pass')?.value;
  const confirm = $('#reg-confirm')?.value;
  if (!name || !phone) return alert('يرجى إدخال الاسم ورقم الهاتف');
  if (!pass || pass.length < 6) return alert('كلمة المرور 6 أحرف على الأقل');
  if (pass !== confirm) return alert('كلمتا المرور غير متطابقتين');
  try {
    const res = await api('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, phone, email, password: pass }) });
    if (res.error) throw new Error(res.error);
    state.customer = res.customer;
    localStorage.setItem('bfix-customer', JSON.stringify(res.customer));
    navigate('home');
  } catch (err) { alert(err.message); }
};

// ─── Profile ───
function renderProfile() {
  if (!state.customer) { navigate('login'); return ''; }
  return `
    <button class="back" onclick="navigate('home')">← الرئيسية</button>
    <div class="card" style="text-align:center">
      <div style="width:72px;height:72px;border-radius:99px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#fff;margin:0 auto">${state.customer.name.charAt(0)}</div>
      <h2 style="font-size:20px;font-weight:900;margin-top:0.75rem">${state.customer.name}</h2>
      <div class="text-sm text-t2">📱 ${state.customer.phone}</div>
      ${state.customer.email ? `<div class="text-sm text-t2">✉️ ${state.customer.email}</div>` : ''}
      <div class="balance-box mt-2"><div class="balance-label">الرصيد</div><div class="balance-amount">$${state.customer.balance?.toLocaleString() || '0'}</div></div>
      <button class="btn btn-ghost mt-2" onclick="state.customer=null;localStorage.removeItem('bfix-customer');navigate('home')">تسجيل الخروج</button>
    </div>`;
}

// ─── Product card helper ───
function pcard(p) {
  return `<div class="card pcard" onclick="navigate('product/${p.id}')">
    <div class="pcard-icon" style="background:linear-gradient(135deg,var(--gold),var(--gold2))">${p.icon || '✨'}</div>
    <div class="pcard-info">
      <div style="display:flex;align-items:center;gap:6px">
        <div class="pcard-name">${p.name}</div>
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      </div>
      <div class="pcard-desc">${p.description}</div>
      ${p.categoryName ? `<div class="text-xs text-t3">${p.categoryName}</div>` : ''}
    </div>
    <div class="pcard-price">
      <div class="amount">$${Number(p.price).toLocaleString()}</div>
      ${p.unit ? `<div class="unit">${p.unit}</div>` : ''}
    </div>
  </div>`;
}

// ─── Init ───
navigate('home');

// Auto-login: customer is already in localStorage, no need to re-login
if (state.customer) {
  // Refresh balance in background
  api(`/api/customers/${state.customer.id}`).then(d => {
    if (d && !d.error) {
      state.customer.balance = Number(d.balance ?? 0);
      localStorage.setItem('bfix-customer', JSON.stringify(state.customer));
    }
  }).catch(() => {});
}
