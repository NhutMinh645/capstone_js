import CartItem from './cartItem.js';

export default class Cart {
    constructor() {
        this.items = [];
        this.loadFromLocalStorage();
    }

    // Thêm sản phẩm vào giỏ hàng
    addItem(product) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(new CartItem(product, 1));
        }
        this.saveToLocalStorage();
        this.renderCart(); // Cập nhật giỏ hàng sau khi thêm
        this.updateCartItemCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveToLocalStorage();
                this.renderCart(); // Cập nhật giỏ hàng sau khi thay đổi
                this.updateCartItemCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
            }
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveToLocalStorage();
        this.renderCart(); // Cập nhật giỏ hàng sau khi xóa
        this.updateCartItemCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
    }

    // Xóa hết các sản phẩm trong giỏ hàng
    clearCart() { 
        this.items = [];
        this.saveToLocalStorage();
        this.renderCart(); // Cập nhật giỏ hàng sau khi xóa hết
        this.updateCartItemCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
    }

    // Tính tổng giá trị của giỏ hàng
    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    // Cập nhật hàm renderCart để hiển thị giống như displayCart
renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = ''; // Làm sạch trước khi hiển thị lại

    // Hiển thị các mục giỏ hàng giống displayCart
    this.items.forEach(item => {
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
                <input type="text" value="${item.quantity}" class="w-10 text-center border-gray-300" readonly>
                <button class="border px-2 " onclick="updateQuantity('${item.product.id}', 1)">+</button>
                <button class="ml-2 px-2 py-1 bg-red-500 text-white rounded" onclick="removeFromCart('${item.product.id}')">Xóa</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Cập nhật tổng giá trị giỏ hàng
    totalPriceElement.textContent = `${this.getTotalPrice()}`;

}


    // Cập nhật số lượng sản phẩm trong biểu tượng giỏ hàng
    updateCartItemCount() {
        const cartItemCount = document.getElementById('cart-item-count');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        // Hiển thị hoặc ẩn số lượng sản phẩm trong giỏ hàng
    if (totalItems > 0) {
        cartItemCount.textContent = totalItems;  // Hiển thị số lượng sản phẩm
        cartItemCount.classList.remove('hidden'); // Hiển thị phần tử số lượng
    } else {
        cartItemCount.classList.add('hidden'); // Ẩn phần tử số lượng khi giỏ hàng trống
    }
    }

    // Hiển thị hoặc ẩn giỏ hàng
    toggleCart() {
        const cartContainer = document.getElementById('cart-container');
        cartContainer.classList.toggle('hidden');
    }

    // Lưu giỏ hàng vào localStorage
    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Tải giỏ hàng từ localStorage
    loadFromLocalStorage() {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            this.items = JSON.parse(cartData).map(item => new CartItem(item.product, item.quantity));
        }
    }
}
