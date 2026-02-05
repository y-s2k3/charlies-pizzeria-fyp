// ============================================
// ADMIN PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'admin') {
        alert('Admin access required. Redirecting to login...');
        window.location.href = 'login.html';
        return;
    }
    
    // Display admin name
    const adminNameElement = document.querySelector('.sidebar-header p');
    if (adminNameElement) {
        adminNameElement.textContent = `Logged in as: ${currentUser.name}`;
    }
    
    const activeOrdersContainer = document.querySelector('.active-orders');
    const todayOrdersElement = document.querySelector('.stat-number');
    
    // Load orders
    function loadOrders() {
        const orders = getAllOrders();
        const today = new Date().toDateString();
        
        // Count today's orders
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp).toDateString();
            return orderDate === today;
        });
        
        // Update stats
        if (todayOrdersElement) {
            todayOrdersElement.textContent = todayOrders.length;
        }
        
        // Clear and reload active orders
        activeOrdersContainer.innerHTML = '<h2>ACTIVE ORDERS</h2>';
        
        if (orders.length === 0) {
            activeOrdersContainer.innerHTML += `
                <div class="no-orders">
                    <i class="fas fa-clipboard-list fa-3x"></i>
                    <h3>No orders yet</h3>
                    <p>Orders will appear here when customers place them.</p>
                </div>
            `;
            return;
        }
        
        // Display last 5 orders
        orders.slice(0, 5).forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-card';
            orderElement.innerHTML = `
                <div class="order-header">
                    <h3>#${order.id} - ${order.customer}</h3>
                    <span class="order-total">${formatPrice(order.total)}</span>
                </div>
                <div class="order-status-badge">
                    <span class="status status-${order.status}">${getStatusText(order.status)}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                </div>
                <button class="btn-update" data-order="${order.id}">
                    <i class="fas fa-sync-alt"></i> Update Status
                </button>
            `;
            activeOrdersContainer.appendChild(orderElement);
        });
        
        // Add event listeners to update buttons
        document.querySelectorAll('.btn-update').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = parseInt(this.getAttribute('data-order'));
                updateOrderStatusPopup(orderId);
            });
        });
    }
    
    // Popup for updating order status
    function updateOrderStatusPopup(orderId) {
        const order = getOrder(orderId);
        if (!order) return;
        
        const statusOptions = [
            { value: 1, label: 'Ordered' },
            { value: 2, label: 'Preparing' },
            { value: 3, label: 'Baking' },
            { value: 4, label: 'Out for Delivery' },
            { value: 5, label: 'Delivered' }
        ];
        
        let optionsHTML = '';
        statusOptions.forEach(option => {
            const selected = order.status === option.value ? 'selected' : '';
            optionsHTML += `<option value="${option.value}" ${selected}>${option.label}</option>`;
        });
        
        const newStatus = prompt(
            `Update status for Order #${orderId}:\n\n` +
            `Customer: ${order.customer}\n` +
            `Current Status: ${getStatusText(order.status)}\n\n` +
            `Select new status:`,
            order.status
        );
        
        if (newStatus !== null) {
            const statusNum = parseInt(newStatus);
            if (statusNum >= 1 && statusNum <= 5 && statusNum !== order.status) {
                if (updateOrderStatus(orderId, statusNum)) {
                    alert(`Order #${orderId} status updated to: ${getStatusText(statusNum)}`);
                    loadOrders();
                    
                    // Show notification on tracking page if open
                    if (window.parent && window.parent.updateStatusTimeline) {
                        window.parent.updateStatusTimeline(statusNum);
                    }
                }
            }
        }
    }
    
    // Quick actions buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            switch(action) {
                case 'Add New Item':
                    alert('Add New Item feature would open a form in a real application.');
                    break;
                case 'Generate Report':
                    alert('Generating sales report...\nThis would download a CSV file in a real application.');
                    break;
                case 'Manage Staff':
                    alert('Staff management panel would open in a real application.');
                    break;
                case 'View Analytics':
                    alert('Opening analytics dashboard...\nThis would show charts and graphs in a real application.');
                    break;
            }
        });
    });
    
    // Logout button
    const logoutBtn = document.querySelector('a.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
            window.location.href = 'login.html';
        });
    }
    
    // Auto-refresh orders every 30 seconds
    setInterval(loadOrders, 30000);
    
    // Initial load
    loadOrders();
});