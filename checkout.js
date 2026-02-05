// ============================================
// CHECKOUT PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutItems = document.getElementById('checkoutItems');
    const totalAmount = document.querySelector('.total-amount');
    
    const DELIVERY_FEE = 2.99;
    
    // Load order summary
    function loadOrderSummary() {
        const cart = getCart();
        const subtotal = getCartTotal();
        const total = subtotal + DELIVERY_FEE;
        
        // Update total amount
        totalAmount.textContent = formatPrice(total);
        
        // Update place order button
        const placeOrderBtn = document.querySelector('button[type="submit"]');
        if (placeOrderBtn) {
            placeOrderBtn.innerHTML = `PLACE ORDER - ${formatPrice(total)}`;
        }
        
        // Generate items list
        checkoutItems.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-row';
            itemElement.innerHTML = `
                <span>${item.quantity} x ${item.name}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            `;
            checkoutItems.appendChild(itemElement);
        });
        
        // Add totals
        const subtotalRow = document.createElement('div');
        subtotalRow.className = 'summary-row';
        subtotalRow.innerHTML = `
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
        `;
        checkoutItems.appendChild(subtotalRow);
        
        const deliveryRow = document.createElement('div');
        deliveryRow.className = 'summary-row';
        deliveryRow.innerHTML = `
            <span>Delivery</span>
            <span>${formatPrice(DELIVERY_FEE)}</span>
        `;
        checkoutItems.appendChild(deliveryRow);
        
        const totalRow = document.createElement('div');
        totalRow.className = 'summary-row grand-total';
        totalRow.innerHTML = `
            <span>Total</span>
            <span>${formatPrice(total)}</span>
        `;
        checkoutItems.appendChild(totalRow);
    }
    
    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty! Please add items from the menu.');
                window.location.href = 'menu.html';
                return;
            }
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            // Check if user is logged in
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('Please login first to place an order.');
                window.location.href = 'login.html';
                return;
            }
            
            // Create order
            const orderId = createOrder(fullName, address, phone, paymentMethod);
            
            if (orderId) {
                alert(`🎉 Order #${orderId} placed successfully!\n\nYou can track your order on the tracking page.`);
                window.location.href = `tracking.html?order=${orderId}`;
            }
        });
    }
    
    // Initial load
    loadOrderSummary();
});