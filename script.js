// --- DATA INITIALIZATION ---
let products = JSON.parse(localStorage.getItem('dm_products')) || [
    { id: 1, name: "Premium Basmati Rice", price: 110, cat: "Grocery", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", desc: "Best for Biryani, direct from Doon valley." },
    { id: 2, name: "Fresh Paneer (200g)", price: 85, cat: "Dairy", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400", desc: "Pure milk paneer made daily." },
    { id: 3, name: "Organic Honey", price: 250, cat: "Organic", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", desc: "Raw honey from Mussoorie hills." }
];

let cart = [];
let currentCategory = "All";

// --- CORE FUNCTIONS ---

// Load products on start
function init() {
    renderProducts(products);
    updateCartCount();
}

// Render product cards
function renderProducts(dataList) {
    const display = document.getElementById('productDisplay');
    display.innerHTML = "";

    if (dataList.length === 0) {
        display.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No products found. Try adding some!</p>`;
        return;
    }

    dataList.forEach(p => {
        display.innerHTML += `
            <div class="card">
                <img src="${p.img || 'https://via.placeholder.com/400x200?text=NearKart'}" class="card-img" alt="${p.name}">
                <div class="card-body">
                    <span class="card-cat">${p.cat}</span>
                    <h3 class="card-title">${p.name}</h3>
                    <p style="font-size:0.8rem; color:#64748b; margin-bottom:10px;">${p.desc.substring(0, 50)}...</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="card-price">₹${p.price}</span>
                        <button class="btn-primary" onclick="addToCart(${p.id})">Add</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Add to Cart
function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCartCount();
    showNotify(`✅ Added ${item.name} to cart!`);
}

function updateCartCount() {
    document.getElementById('cart-badge').innerText = cart.length;
}

// Filter by Category
function filterByCategory(cat, btn) {
    currentCategory = cat;
    // Update active pill
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');

    if (cat === "All") {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.cat === cat);
        renderProducts(filtered);
    }
}

// Search Logic
function handleSearch() {
    const query = document.getElementById('mainSearch').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.cat.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

// Add New Product (Admin)
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('inName').value,
        price: document.getElementById('inPrice').value,
        cat: document.getElementById('inCat').value,
        img: document.getElementById('inImg').value,
        desc: document.getElementById('inDesc').value
    };

    products.unshift(newProduct); // Add to start
    localStorage.setItem('dm_products', JSON.stringify(products));
    
    renderProducts(products);
    closeModal('adminModal');
    showNotify("🚀 Your product is now live!");
    e.target.reset();
});

// Cart & Checkout Flow
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
    if(id === 'cartModal') renderCart();
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function renderCart() {
    const cartList = document.getElementById('cartList');
    const totalDisp = document.getElementById('totalPrice');
    
    if(cart.length === 0) {
        cartList.innerHTML = "<p style='text-align:center;'>Cart is empty.</p>";
        totalDisp.innerText = "₹0";
        return;
    }

    cartList.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>₹${item.price} <button onclick="removeItem(${index})" style="background:none; border:none; color:red; cursor:pointer;">✖</button></span>
        </div>
    `).join('');

    const total = cart.reduce((sum, i) => sum + Number(i.price), 0);
    totalDisp.innerText = `₹${total}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
    updateCartCount();
}

function checkout() {
    if(cart.length === 0) return alert("Bhai, cart khali hai!");
    alert("Order Successful! Your local vendor will contact you soon for delivery in Dehradun.");
    cart = [];
    updateCartCount();
    closeModal('cartModal');
}

function showNotify(msg) {
    const n = document.getElementById('notification');
    n.innerText = msg;
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 3000);
}

// Start
init();

// Newsletter Form Submission
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('newsEmail').value;
    
    // Simulating API call
    showNotify(`📩 Welcome to the club! Updates will be sent to ${email}`);
    this.reset();
});

// Smooth scroll for footer links (Optional but good)
document.querySelectorAll('.footer-col a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuIcon = document.querySelector('#mobile-menu i');

    navLinks.classList.toggle('active');

    // Icon change: Bars to 'X' (Close)
    if (navLinks.classList.contains('active')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
    } else {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    }
}

// Close menu when clicking outside (Optional but pro)
document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('mobile-menu');
    
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        document.querySelector('#mobile-menu i').classList.replace('fa-xmark', 'fa-bars');
    }
});