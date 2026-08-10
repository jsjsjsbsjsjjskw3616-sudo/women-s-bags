// قائمة المنتجات الأساسية
const products = [
    { id: 1, name: "شنطة يد جلدية فاخرة", category: "شنط يد", price: 750, image: "images/WhatsApp Image 2026-08-10 at 01.56.48 (2).jpeg" },
    { id: 2, name: "حقيبة ظهر عصرية كاجوال", category: "حقائب ظهر", price: 450, image: "images/WhatsApp Image 2026-08-10 at 01.56.48 (1).jpeg" },
    { id: 3, name: "شنطة سهرات ومناسبات أنيقة", category: "شنط سهرة", price: 600, image: "images/R.jfif" },
    { id: 4, name: "حقيبة كتف عملية واسعة", category: "شنط كتف", price: 550, image: "images/WhatsApp Image 2026-08-10 at 01.56.48.jpeg" },
    { id: 5, name: "شنطة سفر جلدية كبيرة", category: "شنط سفر", price: 1200, image: "images/WhatsApp Image 2026-08-10 at 02.04.06 (1).jpeg" },
    { id: 6, name: "حقيبة كروص صغيرة كيوت", category: "شنط كروس", price: 350, image: "images/WhatsApp Image 2026-08-10 at 02.04.06.jpeg" }
];

let cart = [];

// عرض المنتجات في الصفحة الرئيسية مع ربط الصورة بصفحة التفاصيل
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <a href="details.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&category=${encodeURIComponent(product.category)}">
                <img src="${product.image}" alt="${product.name}" style="width:100%; height:200px; object-fit:cover; border-radius: 5px;">
            </a>
            <div class="product-info" style="padding: 10px;">
                <h3>${product.name}</h3>
                <p class="price">${product.price} ج.م</p>
                <button onclick="addToCart(${product.id})" style="background: #007bff; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">إضافة إلى السلة</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// إضافة منتج للسلة (بدون فتح السلة تلقائياً، فقط زيادة العداد)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
    
    // إشعار صغير خفيف بدل ما نفتح السلة بالغصب
    alert(`تمت إضافة "${product.name}" إلى السلة بنجاح! 🛒`);
}

// تحديث واجهة السلة (العداد، المنتجات، الإجمالي، وفورم البيانات)
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('total-price');

    if (cartCount) cartCount.textContent = cart.length;
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">سلة المشتريات فارغة حالياً.</p>';
        if (totalPriceElement) totalPriceElement.textContent = '0';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <span>${item.name} - ${item.price} ج.م</span>
                <button onclick="removeFromCart(${index})" style="background: #dc3545; color: white; border: none; padding: 2px 6px; cursor: pointer; border-radius: 3px;">حذف</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    if (totalPriceElement) totalPriceElement.textContent = total;
}

// حذف منتج من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// فتح وإغلاق نافذة السلة (عند الضغط على زر السلة الخارجي فقط)
function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    }
}

// تأكيد الطلب وحفظه في لوحة التحكم المحلية (admin.html)
function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("السلة فارغة، أضف منتجات أولاً!");
        return;
    }

    const newOrder = {
        id: Date.now(),
        customer_name: document.getElementById('customer-name').value,
        customer_phone: document.getElementById('customer-phone').value,
        customer_address: document.getElementById('customer-address').value,
        cart_items: cart.map(item => `${item.name} (${item.price} ج.م)`).join(' ، '),
        total_price: document.getElementById('total-price') ? document.getElementById('total-price').textContent : '0',
        date: new Date().toLocaleString()
    };

    // حفظ الطلب في الـ LocalStorage عشان يظهر في لوحة التحكم admin.html
    let orders = JSON.parse(localStorage.getItem('store_orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('store_orders', JSON.stringify(orders));

    alert("تم تأكيد طلبك بنجاح! تم إرساله إلى لوحة التحكم الخاصة بالمتجر.");
    
    cart = [];
    updateCartUI();
    document.getElementById('order-form').reset();
    toggleCartModal();
}

// تشغيل الوظائف عند فتح الصفحة
window.onload = () => {
    displayProducts();
    updateCartUI();
};