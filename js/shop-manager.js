// shop-manager.js

// Shared LocalStorage Key
const CART_KEY = '995_cart';

// State
let products = [];
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

// DOM Elements
const loadingState = document.getElementById('loading-state');
const productsSection = document.getElementById('products-section');
const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const productModal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const addToCartBtn = document.getElementById('add-to-cart-btn');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchProducts();

    // Modal Events
    closeModalBtn.addEventListener('click', closeModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });
});

// --- Fetch Products ---
async function fetchProducts() {
    try {
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getProducts`);
        const result = await response.json();

        if (result.status === 'success') {
            products = result.data;
            renderProducts(products);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.warn('API Error (Offline Mode?):', error);
        // Fallback to LocalStorage (simulated DB from Admin)
        const localProds = localStorage.getItem('products');
        if (localProds) {
            products = JSON.parse(localProds);
            renderProducts(products);
        } else {
            loadingState.innerHTML = '<p class="text-red-500">ไม่สามารถโหลดข้อมูลสินค้าได้</p>';
        }
    }
}

// --- Render Products ---
function renderProducts(items) {
    loadingState.classList.add('hidden');
    productsSection.classList.remove('hidden');
    productsSection.classList.add('fade-in');

    if (items.length === 0) {
        productsGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">ไม่มีสินค้าในขณะนี้</div>';
        return;
    }

    productsGrid.innerHTML = items.map(product => {
        const price = parseInt(product.price);
        const discount = parseInt(product.discount || 0);
        const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

        return `
        <div class="glass-card p-4 flex flex-col h-full cursor-pointer group" onclick="openProductModal('${product.id}')">
            <div class="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-800">
                <img src="${product.image_url}" alt="${product.name_th}" 
                     class="object-cover w-full h-full transform transition duration-500 group-hover:scale-110"
                     onerror="this.src='https://placehold.co/400x400?text=No+Image'">
                ${discount > 0 ? `<div class="absolute top-2 right-2 bg-[var(--neon-magenta)] text-white text-xs font-bold px-2 py-1 rounded">SALE -${discount}%</div>` : ''}
            </div>
            
            <h3 class="text-xl font-heading text-white mb-2 group-hover:text-[var(--neon-cyan)] transition">${product.name_th}</h3>
            
            <div class="mt-auto flex justify-between items-end">
                <div>
                    ${discount > 0 ? `<span class="text-sm text-gray-400 line-through">฿${price.toLocaleString()}</span>` : ''}
                    <div class="text-2xl font-bold text-[var(--neon-cyan)]">฿${finalPrice.toLocaleString()}</div>
                </div>
                <button class="w-10 h-10 rounded-full border border-[var(--neon-cyan)] flex items-center justify-center text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black transition">
                    +
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// --- Modal Logic ---
let currentProduct = null;

function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    const price = parseInt(currentProduct.price);
    const discount = parseInt(currentProduct.discount || 0);
    const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

    document.getElementById('modal-image').src = currentProduct.image_url;
    document.getElementById('modal-name').textContent = currentProduct.name_th;
    document.getElementById('modal-description').textContent = currentProduct.description_th || 'ไม่มีรายละเอียด';

    const priceEl = document.getElementById('modal-price');
    if (discount > 0) {
        priceEl.innerHTML = `<span class="text-2xl text-gray-500 line-through mr-3">฿${price.toLocaleString()}</span> <span class="text-[var(--neon-cyan)]">฿${finalPrice.toLocaleString()}</span>`;
    } else {
        priceEl.textContent = `฿${price.toLocaleString()}`;
    }

    // Bind Add to Cart
    addToCartBtn.onclick = () => addToCart(currentProduct);

    productModal.classList.remove('hidden');
    productModal.classList.add('flex');
}

function closeModal() {
    productModal.classList.add('hidden');
    productModal.classList.remove('flex');
    currentProduct = null;
}

// --- Cart Logic ---
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    const price = parseInt(product.price);
    const discount = parseInt(product.discount || 0);
    const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name_th: product.name_th,
            price: price,
            finalPrice: finalPrice,
            image_url: product.image_url,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    closeModal();

    // Simple Toast/Alert
    alert(`เพิ่ม "${product.name_th}" ลงตะกร้าแล้ว!`);
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = total;
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Expose to window for inline onclicks
window.openProductModal = openProductModal;
window.fetchProducts = fetchProducts; // accessible if needed
