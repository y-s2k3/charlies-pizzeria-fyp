// ============================================
// TRACKING PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Get order ID from URL or use latest
    const urlParams = new URLSearchParams(window.location.search);
    let orderId = parseInt(urlParams.get('order'));
    
    // If no order in URL, get latest order
    if (!orderId) {
        const orders = getAllOrders();
        if (orders.length > 0) {
            orderId = orders[0].id;
        }
    }
    
    // Update page title and header
    const pageTitle = document.querySelector('h1');
    if (pageTitle && orderId) {
        pageTitle.textContent = `Track Order #${orderId}`;
    }
    
    // Load order details
    function loadOrderDetails() {
        if (!orderId) {
            document.querySelector('.order-status').innerHTML = `
                <div class="no-order">
                    <i class="fas fa-search fa-3x" style="color: #ccc; margin-bottom: 20px;"></i>
                    <h3 style="color: #666;">No order found</h3>
                    <p style="color: #999; margin-bottom: 20px;">Place an order first to track it.</p>
                    <a href="menu.html" class="btn-primary">Browse Menu</a>
                </div>
            `;
            return;
        }
        
        const order = getOrder(orderId);
        
        if (!order) {
            document.querySelector('.order-status').innerHTML = `
                <div class="no-order">
                    <i class="fas fa-exclamation-triangle fa-3x" style="color: #ffa726; margin-bottom: 20px;"></i>
                    <h3 style="color: #666;">Order #${orderId} not found</h3>
                    <a href="menu.html" class="btn-primary">Browse Menu</a>
                </div>
            `;
            return;
        }
        
        // Update order details section
        const orderDetails = document.querySelector('.order-details');
        if (orderDetails) {
            let itemsHTML = '';
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="detail-row">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `;
            });
            
            orderDetails.innerHTML = `
                <h3>Order #${orderId} Details</h3>
                ${itemsHTML}
                <div class="detail-row">
                    <span>Delivery Fee</span>
                    <span>${formatPrice(order.delivery)}</span>
                </div>
                <div class="detail-row total">
                    <span>Total</span>
                    <span>${formatPrice(order.total)}</span>
                </div>
                <div class="detail-row">
                    <span>Delivery Address</span>
                    <span>${order.address}</span>
                </div>
                <div class="detail-row">
                    <span>Payment Method</span>
                    <span>${order.payment === 'card' ? 'Credit Card' : 'Cash on Delivery'}</span>
                </div>
            `;
        }
        
        // Update status timeline
        updateStatusTimeline(order.status);
    }
    
    // Update status timeline visualization
    function updateStatusTimeline(currentStatus) {
        const statusSteps = document.querySelectorAll('.status-step');
        statusSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            // Reset all steps
            step.classList.remove('completed', 'active');
            
            // Mark completed steps
            if (stepNumber < currentStatus) {
                step.classList.add('completed');
            }
            // Mark current step
            else if (stepNumber === currentStatus) {
                step.classList.add('active');
            }
        });
        
        // Update status text
        const statusElement = document.querySelector('.status-step.active .step-info h3');
        if (statusElement) {
            document.querySelector('.order-status h2').textContent = 
                `ORDER STATUS: ${statusElement.textContent.toUpperCase()}`;
        }
    }
    
    // Auto-refresh order status every 10 seconds (simulating real-time updates)
    if (orderId) {
        setInterval(() => {
            const order = getOrder(orderId);
            if (order) {
                updateStatusTimeline(order.status);
            }
        }, 10000);
    }
    
    // Initial load
    loadOrderDetails();
});