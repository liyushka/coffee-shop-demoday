let currentLang = localStorage.getItem('ec_lang') || 'uz';
let currentTheme = localStorage.getItem('ec_theme') || 'light';
let cart = JSON.parse(localStorage.getItem('ec_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('ec_favs')) || [];
let activeCategory = 'all';

window.onload = function() {
    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = currentLang;
    applyTranslations();

    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        const sun = document.getElementById('theme-icon-sun');
        const moon = document.getElementById('theme-icon-moon');
        if (sun) sun.classList.remove('hidden');
        if (moon) moon.classList.add('hidden');
    }

    renderHomeFeatured();
    renderMenu();
    updateBadges();
    renderFavorites();
    renderCart();
};

function toggleTheme() {
    const sun = document.getElementById('theme-icon-sun');
    const moon = document.getElementById('theme-icon-moon');
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        currentTheme = 'light';
        if (sun) sun.classList.add('hidden');
        if (moon) moon.classList.remove('hidden');
    } else {
        document.documentElement.classList.add('dark');
        currentTheme = 'dark';
        if (sun) sun.classList.remove('hidden');
        if (moon) moon.classList.add('hidden');
    }
    localStorage.setItem('ec_theme', currentTheme);
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ec_lang', lang);
    applyTranslations();
    renderHomeFeatured();
    renderMenu();
    renderFavorites();
    renderCart();
}

function applyTranslations() {
    const dict = translations[currentLang] || translations.uz;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });
}

function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || translations.uz[key] || key;
}

function switchTab(tabId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    const targetPage = document.getElementById('page-' + tabId);
    if (targetPage) targetPage.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeNav = document.getElementById('nav-' + tabId);
    if (activeNav) activeNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = "bg-espresso text-cream border border-caramel/40 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 transform transition-all duration-300 opacity-0 translate-y-2 pointer-events-auto";
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-caramel"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => toast.classList.remove('opacity-0', 'translate-y-2'), 10);
    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function renderHomeFeatured() {
    const container = document.getElementById('home-featured-grid');
    if (!container) return;
    const featuredItems = productsData.filter(p => p.featured);
    
    container.innerHTML = featuredItems.map(item => `
        <div class="bg-white dark:bg-espresso/50 border border-beige dark:border-espresso rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div class="h-48 overflow-hidden relative">
                <img src="${item.img}" alt="${item.name[currentLang]}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <button onclick="toggleFavorite(${item.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center text-red-500">
                    <i class="${favorites.includes(item.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>
            <div class="p-5 flex flex-col justify-between space-y-3">
                <div>
                    <h4 class="font-bold font-serif-heading text-base">${item.name[currentLang]}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">${item.desc[currentLang]}</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-beige dark:border-espresso">
                    <span class="font-bold text-sm text-caramel">${item.price.toLocaleString()} UZS</span>
                    <button onclick="addToCart(${item.id})" class="p-2 bg-caramel hover:bg-caramel-hover text-white rounded-xl text-xs transition-colors">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-caramel', 'text-white');
        btn.classList.add('bg-beige', 'dark:bg-espresso', 'text-espresso', 'dark:text-cream');
    });
    const activeBtn = document.getElementById('cat-' + cat);
    if (activeBtn) {
        activeBtn.classList.remove('bg-beige', 'dark:bg-espresso', 'text-espresso', 'dark:text-cream');
        activeBtn.classList.add('bg-caramel', 'text-white');
    }
    renderMenu();
}

function filterMenu() {
    renderMenu();
}

function renderMenu() {
    const container = document.getElementById('menu-grid');
    if (!container) return;

    const searchQuery = (document.getElementById('menu-search')?.value || '').toLowerCase();
    const sortVal = document.getElementById('menu-sort')?.value || 'default';

    let list = productsData.filter(item => {
        const matchCat = activeCategory === 'all' || item.category === activeCategory;
        const matchSearch = item.name[currentLang].toLowerCase().includes(searchQuery) ||
                            item.desc[currentLang].toLowerCase().includes(searchQuery);
        return matchCat && matchSearch;
    });

    if (sortVal === 'low-high') list.sort((a, b) => a.price - b.price);
    else if (sortVal === 'high-low') list.sort((a, b) => b.price - a.price);

    container.innerHTML = list.map(item => `
        <div class="bg-white dark:bg-espresso/50 border border-beige dark:border-espresso rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
                <div class="h-48 overflow-hidden relative">
                    <img src="${item.img}" alt="${item.name[currentLang]}" class="w-full h-full object-cover">
                    <button onclick="toggleFavorite(${item.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center text-red-500">
                        <i class="${favorites.includes(item.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="p-5">
                    <h4 class="font-bold font-serif-heading text-base">${item.name[currentLang]}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1.5">${item.desc[currentLang]}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-beige/60 dark:border-espresso/60 mt-2">
                <span class="font-bold text-sm text-caramel">${item.price.toLocaleString()} UZS</span>
                <button onclick="addToCart(${item.id})" class="px-3 py-2 bg-caramel text-white rounded-xl text-xs font-semibold hover:bg-caramel-hover transition-colors">
                    ${t('btn_add_to_cart')}
                </button>
            </div>
        </div>
    `).join('');
}

function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast(t('toast_removed_fav'));
    } else {
        favorites.push(id);
        showToast(t('toast_added_fav'));
    }
    localStorage.setItem('ec_favs', JSON.stringify(favorites));
    updateBadges();
    renderHomeFeatured();
    renderMenu();
    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById('fav-grid');
    const emptyState = document.getElementById('fav-empty-state');
    if (!container || !emptyState) return;

    const list = productsData.filter(p => favorites.includes(p.id));

    if (list.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    container.classList.remove('hidden');

    container.innerHTML = list.map(item => `
        <div class="bg-white dark:bg-espresso/50 border border-beige dark:border-espresso rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
                <div class="h-44 overflow-hidden relative">
                    <img src="${item.img}" alt="${item.name[currentLang]}" class="w-full h-full object-cover">
                    <button onclick="toggleFavorite(${item.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center text-red-500">
                        <i class="fa-solid fa-heart text-red-500"></i>
                    </button>
                </div>
                <div class="p-5">
                    <h4 class="font-bold font-serif-heading text-base">${item.name[currentLang]}</h4>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between">
                <span class="font-bold text-sm text-caramel">${item.price.toLocaleString()} UZS</span>
                <button onclick="addToCart(${item.id})" class="px-3 py-2 bg-caramel text-white rounded-xl text-xs font-semibold hover:bg-caramel-hover transition-colors">
                    ${t('btn_add_to_cart')}
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: id, quantity: 1 });
    }
    localStorage.setItem('ec_cart', JSON.stringify(cart));
    updateBadges();
    renderCart();
    showToast(t('toast_added_cart'));
}

function updateCartQty(id, delta) {
    const index = cart.findIndex(item => item.id === id);
    if (index > -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }
    localStorage.setItem('ec_cart', JSON.stringify(cart));
    updateBadges();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('ec_cart', JSON.stringify(cart));
    updateBadges();
    renderCart();
}

function clearCart() {
    cart = [];
    localStorage.setItem('ec_cart', JSON.stringify(cart));
    updateBadges();
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const wrapper = document.getElementById('cart-content-wrapper');
    const emptyState = document.getElementById('cart-empty-state');
    if (!container || !wrapper || !emptyState) return;

    if (cart.length === 0) {
        wrapper.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    wrapper.classList.remove('hidden');

    let subtotal = 0;

    container.innerHTML = cart.map(cartItem => {
        const product = productsData.find(p => p.id === cartItem.id);
        if (!product) return '';
        const itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;

        return `
            <div class="flex items-center justify-between p-4 bg-white dark:bg-espresso/50 border border-beige dark:border-espresso rounded-2xl">
                <div class="flex items-center space-x-3">
                    <img src="${product.img}" class="w-14 h-14 rounded-xl object-cover">
                    <div>
                        <h4 class="font-bold text-sm">${product.name[currentLang]}</h4>
                        <span class="text-xs text-caramel font-semibold">${product.price.toLocaleString()} UZS</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 bg-beige dark:bg-espresso rounded-lg px-2 py-1">
                        <button onclick="updateCartQty(${product.id}, -1)" class="w-5 h-5 flex items-center justify-center font-bold text-xs">-</button>
                        <span class="text-xs font-bold w-4 text-center">${cartItem.quantity}</span>
                        <button onclick="updateCartQty(${product.id}, 1)" class="w-5 h-5 flex items-center justify-center font-bold text-xs">+</button>
                    </div>
                    <button onclick="removeFromCart(${product.id})" class="text-red-500 text-xs">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const subEl = document.getElementById('summary-subtotal');
    const totEl = document.getElementById('summary-total');
    if (subEl) subEl.innerText = subtotal.toLocaleString() + ' UZS';
    if (totEl) totEl.innerText = subtotal.toLocaleString() + ' UZS';
}

function updateBadges() {
    const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const favCount = favorites.length;

    const cBadge = document.getElementById('cart-badge');
    const cBadgeMobile = document.getElementById('cart-badge-mobile');
    const fBadge = document.getElementById('fav-badge');
    const fBadgeMobile = document.getElementById('fav-badge-mobile');

    if (cBadge) {
        cBadge.innerText = totalCartCount;
        cBadge.classList.toggle('hidden', totalCartCount === 0);
    }
    if (cBadgeMobile) cBadgeMobile.innerText = totalCartCount;

    if (fBadge) {
        fBadge.innerText = favCount;
        fBadge.classList.toggle('hidden', favCount === 0);
    }
    if (fBadgeMobile) fBadgeMobile.innerText = favCount;
}

function toggleAddressField(show) {
    const addr = document.getElementById('address-container');
    const addrInput = document.getElementById('cust-address');
    if (!addr || !addrInput) return;
    if (show) {
        addr.classList.remove('hidden');
        addrInput.setAttribute('required', 'true');
    } else {
        addr.classList.add('hidden');
        addrInput.removeAttribute('required');
    }
}

async function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) return;

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const method = document.querySelector('input[name="delivery_method"]:checked')?.value || 'pickup';
    const address = document.getElementById('cust-address')?.value.trim() || '';
    const comment = document.getElementById('cust-comment')?.value.trim() || '';

    const btn = document.getElementById('btn-submit-order');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Yuborilmoqda...</span>`;
    }

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                phone,
                fulfillment: method,
                address,
                comment,
                cart
            })
        });

        const data = await response.json();

        if (data.success) {
            clearCart();
            document.getElementById('checkout-form').reset();
            showToast(t('toast_order_success'));
            alert(`✅ Buyurtmangiz yuborildi!\nOrder ID: #${data.orderId}\n\nTelegram botga habar keldi.`);
        } else {
            alert(`❌ Xatolik: ${data.message || 'Xabarni yuborib bo‘lmadi.'}`);
        }
    } catch (err) {
        console.error(err);
        alert('❌ Ошибка подключения к серверу. Убедитесь, что сервер запущен (npm start).');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-paper-plane fa-solid text-sm"></i> <span>${t('btn_place_order')}</span>`;
        }
    }
}