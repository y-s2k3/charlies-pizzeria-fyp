// ============================================
// CHARLIE'S PIZZERIA - SHARED APP FUNCTIONS
// ============================================

// Initialize localStorage with sample data
function initAppData() {
    if (!localStorage.getItem('charliesPizzeria')) {
        const initialData = {
            users: [
                { email: "customer@test.com", password: "123", name: "John", type: "customer" },
                { email: "admin@test.com", password: "admin123", name: "Admin", type: "admin" }
            ],
            menuItems: [
                { id: 1, name: "Margherita Pizza", description: "Fresh tomatoes, mozzarella cheese, basil", price: 9.99, category: "pizza" },
                { id: 2, name: "Pepperoni Pizza", description: "Pepperoni, extra cheese, tomato sauce", price: 10.99, category: "pizza" },
                { id: 3, name: "Garlic Bread", description: "Freshly baked with garlic butter", price: 4.99, category: "sides" },
                { id: 4, name: "Coke", description: "Refreshing Coca-Cola", price: 1.99, category: "drinks" }
            ],
            orders: [
                { 
                    id: 1001, 
                    customer: "John", 
                    items: [
                        { id: 1, name: "Margherita Pizza", price: 9.99, quantity: 1 },
                        { id: 3, name: "Garlic Bread", price: 4.99, quantity: 2 }
                    ],
                    total: 22.96,
                    status: 2, // 1: Ordered, 2: Preparing, 3: Baking, 4: Out for Delivery, 5: Delivered
                    timestamp: new Date().toISOString(),
                    address: "123 Pizza Street, London",
                    payment: "Card"
                },
                { 
                    id: 1002, 
                    customer: "Sarah", 
                    items: [
                        { id: 2, name: "Pepperoni Pizza", price: 10.99, quantity: 1 },
                        { id: 4, name: "Coke", price: 1.99, quantity: 1 }
                    ],
                    total: 15.97,
                    status: 4,
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    address: "456 Cheese Avenue, Manchester",
                    payment: "Cash"
                }
            ],
            currentOrderId: 1003,
            cart: []
        };
        localStorage.setItem('charliesPizzeria', JSON.stringify(initialData));
    }
    return JSON.parse(localStorage.getItem('charliesPizzeria'));
}

// Get cart items
function getCart() {
    const data = initAppData();
    return data.cart;
}

// Add item to cart
function addToCart(itemId, itemName, itemPrice, quantity = 1) {
    const data = initAppData();
    const existingItem = data.cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        data.cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: quantity
        });
    }
    
    localStorage.setItem('charliesPizzeria', JSON.stringify(data));
    updateCartCount();
    return true;
}

// Remove item from cart
function removeFromCart(itemId) {
    const data = initAppData();
    data.cart = data.cart.filter(item => item.id !== itemId);
    localStorage.setItem('charliesPizzeria', JSON.stringify(data));
    updateCartCount();
}

// Update cart quantity
function updateCartQuantity(itemId, quantity) {
    const data = initAppData();
    const cartItem = data.cart.find(item => item.id === itemId);
    
    if (cartItem) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            cartItem.quantity = quantity;
            localStorage.setItem('charliesPizzeria', JSON.stringify(data));
        }
    }
    updateCartCount();
}

// Clear entire cart
function clearCart() {
    const data = initAppData();
    data.cart = [];
    localStorage.setItem('charliesPizzeria', JSON.stringify(data));
    updateCartCount();
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Create new order
function createOrder(customerName, address, phone, paymentMethod) {
    const data = initAppData();
    const cart = data.cart;
    
    if (cart.length === 0) return null;
    
    const subtotal = getCartTotal();
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;
    
    const order = {
        id: data.currentOrderId++,
        customer: customerName,
        items: [...cart],
        subtotal: subtotal,
        delivery: deliveryFee,
        total: total,
        status: 1, // Order placed
        timestamp: new Date().toISOString(),
        address: address,
        phone: phone,
        payment: paymentMethod
    };
    
    data.orders.unshift(order); // Add to beginning of array
    data.cart = []; // Clear cart
    
    localStorage.setItem('charliesPizzeria', JSON.stringify(data));
    updateCartCount();
    
    return order.id;
}

// Get all orders
function getAllOrders() {
    const data = initAppData();
    return data.orders;
}

// Get single order
function getOrder(orderId) {
    const data = initAppData();
    return data.orders.find(order => order.id === orderId);
}

// Update order status (for admin)
function updateOrderStatus(orderId, newStatus) {
    const data = initAppData();
    const order = data.orders.find(order => order.id === orderId);
    
    if (order) {
        order.status = newStatus;
        localStorage.setItem('charliesPizzeria', JSON.stringify(data));
        return true;
    }
    return false;
}

// User login
function loginUser(email, password) {
    const data = initAppData();
    const user = data.users.find(user => user.email === email && user.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// User logout
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Format price
function formatPrice(price) {
    return `£${price.toFixed(2)}`;
}

// Get status text
function getStatusText(statusCode) {
    const statuses = {
        1: 'Ordered',
        2: 'Preparing',
        3: 'Baking',
        4: 'Out for Delivery',
        5: 'Delivered'
    };
    return statuses[statusCode] || 'Unknown';
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initAppData();
    updateCartCount();
    
    // Show current user if logged in
    const user = getCurrentUser();
    if (user && document.getElementById('userName')) {
        document.getElementById('userName').textContent = user.name;
    }
    
    console.log("Charlie's Pizzeria - App initialized!");
});