// ===== 995 EVENTS - SHARED JAVASCRIPT =====

// Storage Keys
const STORAGE_PRODUCTS = '995_products';
const STORAGE_CART = '995_cart';
const STORAGE_BLOG = '995_blog';
const STORAGE_ORDERS = '995_orders';
const STORAGE_USER = '995_current_user';
const SHIPPING_COST = 50;

// Helper Functions
const getProducts = () => JSON.parse(localStorage.getItem(STORAGE_PRODUCTS)) || [];
const saveProducts = (p) => localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(p));
const getCart = () => JSON.parse(localStorage.getItem(STORAGE_CART)) || [];
const saveCart = (c) => { localStorage.setItem(STORAGE_CART, JSON.stringify(c)); updateCartUI(); };
const getBlog = () => JSON.parse(localStorage.getItem(STORAGE_BLOG)) || [];
const saveBlog = (b) => localStorage.setItem(STORAGE_BLOG, JSON.stringify(b));
const getOrders = () => JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || [];
const saveOrders = (o) => localStorage.setItem(STORAGE_ORDERS, JSON.stringify(o));
const getCurrentUser = () => JSON.parse(localStorage.getItem(STORAGE_USER));
const setCurrentUser = (u) => localStorage.setItem(STORAGE_USER, JSON.stringify(u));
const logout = () => { localStorage.removeItem(STORAGE_USER); window.location.href = 'index.html'; };
const genId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const calcPrice = (p, d) => Math.round(p * (1 - (d || 0) / 100));
const formatPrice = (n) => '฿' + n.toLocaleString('th-TH');

// Toast Notification
const showToast = (msg, type = 'success') => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast toast-' + type + ' show';
    setTimeout(() => t.classList.remove('show'), 2500);
};

// Update Cart UI
const updateCartUI = () => {
    const cart = getCart();
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cart-badge');
    const mobileCount = document.getElementById('mobile-cart-count');

    if (badge) {
        if (total > 0) {
            badge.classList.remove('hidden');
            badge.textContent = total;
        } else {
            badge.classList.add('hidden');
        }
    }

    if (mobileCount) mobileCount.textContent = total;
};

// Scroll Animation Observer
const initScrollAnimations = () => {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => obs.observe(el));
};

// Mobile Menu Toggle
const initMobileMenu = () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));

        // Close menu when clicking nav links
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => menu.classList.add('hidden'));
        });
    }
};

// Check if user is logged in
const checkAuth = () => {
    const user = getCurrentUser();
    const userBtn = document.getElementById('user-btn');
    const userMenu = document.getElementById('user-menu');

    if (userBtn && userMenu) {
        if (user) {
            userBtn.innerHTML = `<span>${user.name}</span>`;
            userMenu.classList.remove('hidden');
        } else {
            userBtn.innerHTML = '<span>เข้าสู่ระบบ</span>';
            userMenu.classList.add('hidden');
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initMobileMenu();
    updateCartUI();
    checkAuth();
});
