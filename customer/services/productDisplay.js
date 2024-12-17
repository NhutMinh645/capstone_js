
import Product from '../model/product.js';
import CartItem from './cartItem.js';
import Cart from './cartService.js';

let products = [];
let cart = new Cart();



document.addEventListener("DOMContentLoaded", () => {
    const cart = new Cart(); // Tạo đối tượng giỏ hàng
    cart.loadFromLocalStorage();  // Tải giỏ hàng từ localStorage
    cart.renderCart(); // Hiển thị các mục giỏ hàng khi trang tải

    // Cập nhật số lượng sản phẩm khi trang tải
    cart.updateCartItemCount();

    // Xử lý sự kiện nhấp vào biểu tượng giỏ hàng
    const cartIcon = document.getElementById("cart-icon");
    const closeCart = document.getElementById("close-cart");

    cartIcon.addEventListener("click", () => {
        cart.toggleCart(); // Hiển thị hoặc ẩn giỏ hàng
    });

    closeCart.addEventListener("click", () => {
        cart.toggleCart(); // Ẩn giỏ hàng khi nhấp vào nút đóng
    });
});

async function init() {
    await fetchProducts();
    displayProducts(products);
}

async function fetchProducts() {
    try {
        const response = await fetch('https://672df5b3fd89797156446d13.mockapi.io/Products');
        if (!response.ok) {
            throw new Error('Lỗi khi tải sản phẩm: ' + response.statusText);
        }
        const productData = await response.json();
        products = productData.map(data => new Product(data.id, data.name, data.price, data.img, data.screen, data.backCamera, data.frontCamera, data.desc, data.type));
        cart.loadFromLocalStorage();
        displayProducts(products); // Hiển thị sản phẩm sau khi tải
    } catch (error) {
        console.error(error);
    }
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white p-4 rounded-lg shadow-md';
        productCard.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="object-cover rounded">
            <h3 class="font-bold mt-2">${product.name}</h3>
            <p class="text-gray-600">$${product.price}</p>
            <p class="text-gray-600">${product.screen}</p> 
            <p class="text-gray-600">Camera sau: ${product.backCamera}</p> 
            <p class="text-gray-600">Camera trước: ${product.frontCamera}</p> 
            <p class="text-gray-600">${product.desc}</p> 
            <button class="bg-blue-500 text-white py-1 px-2 mt-2 rounded" data-id="${product.id}">Thêm vào giỏ</button>
        `;
        productContainer.appendChild(productCard);
    });

    const buttons = productContainer.querySelectorAll('button[data-id]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            addToCart(button.getAttribute('data-id'));
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Sản phẩm không tồn tại:', productId);
        return;
    }
    
    cart.addItem(product);
    displayCart();
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    let totalPrice = cart.getTotalPrice();

    cart.items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center justify-between border-b border-gray-200 py-2';
        cartItem.innerHTML = `
            <div class="flex items-center">
                <img src="${item.product.img}" alt="${item.product.name}" class="w-20 h-20 rounded-lg object-cover">
                <div class="ml-4">
                    <h5 class="font-bold">${item.product.name}</h5>
                    <p class="text-gray-600">$${item.product.price}</p>
                </div>
            </div>
            <div class="flex items-center">
                <button class="border px-3" onclick="updateQuantity('${item.product.id}', -1)">-</button>
                <input type="text" value="${item.quantity}" class="w-12 text-center border-gray-300" readonly>
                <button class="border px-2 " onclick="updateQuantity('${item.product.id}', 1)">+</button>
                <button class="ml-2 px-2 py-1 bg-red-500 text-white rounded" onclick="removeFromCart('${item.product.id}')">Xóa</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    document.getElementById('total-price').innerText = totalPrice; 
}

function updateQuantity(productId, change) {
    cart.updateQuantity(productId, change);
    displayCart();
}

function removeFromCart(productId) {
    cart.removeItem(productId);
    displayCart();
}

function handlePayment() {
    const paymentFailed = document.getElementById('payment-failed');

    if (cart.items.length === 0) { 
        paymentFailed.innerText = `Không có sản phẩm trong giỏ hàng.`;
        paymentFailed.classList.remove('hidden');
        paymentFailed.classList.add('opacity-0', 'transition-opacity', 'duration-500');

        setTimeout(() => {
            paymentFailed.classList.remove('opacity-0');
            paymentFailed.classList.add('opacity-100');
        }, 10);

        setTimeout(() => {
            paymentFailed.classList.remove('opacity-100');
            paymentFailed.classList.add('opacity-0');

            setTimeout(() => {
                paymentFailed.classList.add('hidden');
            }, 500); 
        }, 3000); 
        return; 
    }

    const totalPrice = document.getElementById('total-price').innerText;
    const paymentSuccessful = document.getElementById('payment-successful');
    paymentSuccessful.innerText = `Thanh toán thành công với tổng giá $${totalPrice}`;

    paymentSuccessful.classList.remove('hidden');
    paymentSuccessful.classList.add('opacity-0', 'transition-opacity', 'duration-500');

    setTimeout(() => {
        paymentSuccessful.classList.remove('opacity-0');
        paymentSuccessful.classList.add('opacity-100');
    }, 10);

    cart.clearCart();
    displayCart();

    setTimeout(() => {
        paymentSuccessful.classList.remove('opacity-100');
        paymentSuccessful.classList.add('opacity-0');

        setTimeout(() => {
            paymentSuccessful.classList.add('hidden');
        }, 500); 
    }, 3000); 
}

document.getElementById('checkout-button').addEventListener('click', handlePayment); 

function filterProducts() {
    const filterValue = document.getElementById('product-filter').value;
    const filteredProducts = products.filter(product => {
        return filterValue ? product.type === filterValue : true;
    });
    displayProducts(filteredProducts);
}

window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart; 
window.filterProducts = filterProducts;

init();