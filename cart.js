// ============================================
// CART PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const clearCartBtn = document.getElementById('clearCart');
    
    const DELIVERY_FEE = 2.99;
    
    // Load cart items
    function loadCartItems() {
        const cart = getCart();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-3x" style="color: #ccc; margin-bottom: 20px;"></i>
                    <h3 style="color: #666; margin-bottom: 20px;">Your cart is empty</h3>
                    <a href="menu.html" class="btn-primary" style="display: inline-block;">
                        <i class="fas fa-utensils"></i> Browse Menu
                    </a>
                </div>
            `;
            subtotalElement.textContent = formatPrice(0);
            totalElement.textContent = formatPrice(DELIVERY_FEE);
            return;
        }
        
        // Calculate totals
        const subtotal = getCartTotal();
        const total = subtotal + DELIVERY_FEE;
        
        subtotalElement.textContent = formatPrice(subtotal);
        totalElement.textContent = formatPrice(total);
        
        // Update checkout button price
        const checkoutBtn = document.querySelector('a[href="checkout.html"]');
        if (checkoutBtn) {
            checkoutBtn.innerHTML = `CHECKOUT ${formatPrice(total)} <i class="fas fa-arrow-right"></i>`;
        }
        
        // Generate cart items HTML
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-details">
                    <h3>${item.quantity} x ${item.name}</h3>
                    <p class="item-price">${formatPrice(item.price * item.quantity)}</p>
                </div>
                <div class="item-controls">
                    <button class="qty-btn minus" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i> remove
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const cart = getCart();
                const item = cart.find(i => i.id === itemId);
                if (item && item.quantity > 1) {
                    updateCartQuantity(itemId, item.quantity - 1);
                    loadCartItems();
                }
            });
        });
        
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const cart = getCart();
                const item = cart.find(i => i.id === itemId);
                if (item) {
                    updateCartQuantity(itemId, item.quantity + 1);
                    loadCartItems();
                }
            });
        });
        
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                removeFromCart(itemId);
                loadCartItems();
            });
        });
    }
    
    // Clear cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your entire cart?')) {
                clearCart();
                loadCartItems();
            }
        });
    }
    
    // Initial load
    loadCartItems();
});