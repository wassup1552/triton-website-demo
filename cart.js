// ============================================
// SHOPPING CART & ORDER SYSTEM
// ============================================

// Cart state
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('tritonCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('tritonCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(name, price, category) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseInt(price),
            category: category,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showAddedFeedback(event.target);
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-category">${item.category}</span>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">×</button>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <span class="item-total">₹${item.price * item.quantity}</span>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }
    
    // Update total
    totalAmount.textContent = '₹' + calculateTotal();
}

// Show feedback when item is added
function showAddedFeedback(button) {
    button.textContent = 'Added!';
    button.classList.add('added');
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
    }, 1500);
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// Open order modal
function openOrderModal() {
    const modal = document.getElementById('orderModal');
    const summaryItems = document.getElementById('orderSummaryItems');
    const summaryTotal = document.getElementById('summaryTotal');
    
    // Populate order summary
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span class="summary-item-name">${item.name}</span>
            <span class="summary-item-qty">× ${item.quantity}</span>
            <span class="summary-item-price">₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    summaryTotal.textContent = '₹' + calculateTotal();
    
    modal.classList.add('active');
    toggleCart(); // Close cart
}

// Close order modal
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
}

// Handle order type change
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    const orderType = document.getElementById('orderType');
    const addressGroup = document.getElementById('addressGroup');
    const deliveryAddress = document.getElementById('deliveryAddress');
    
    if (orderType) {
        orderType.addEventListener('change', function() {
            if (this.value === 'delivery') {
                addressGroup.style.display = 'block';
                deliveryAddress.required = true;
            } else {
                addressGroup.style.display = 'none';
                deliveryAddress.required = false;
            }
        });
    }
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.dataset.name;
            const price = this.dataset.price;
            const category = this.dataset.category;
            addToCart(name, price, category);
        });
    });
    
    // Cart button
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.addEventListener('click', toggleCart);
    }
    
    // Cart close button
    const cartClose = document.getElementById('cartClose');
    if (cartClose) {
        cartClose.addEventListener('click', toggleCart);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openOrderModal);
    }
    
    // Modal close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeOrderModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeOrderModal();
            }
        });
    }
    
    // Handle form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitOrder();
        });
    }
});

// Submit order
async function submitOrder() {
    const submitBtn = document.querySelector('.submit-order-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    // Collect form data
    const orderData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerEmail: document.getElementById('customerEmail').value || 'N/A',
        orderType: document.getElementById('orderType').value,
        deliveryAddress: document.getElementById('deliveryAddress').value || 'N/A',
        specialInstructions: document.getElementById('specialInstructions').value || 'None',
        items: cart,
        total: calculateTotal(),
        orderDate: new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
        }),
        orderNumber: 'TRI-' + Date.now()
    };
    
    try {
        // Generate Excel file
        await generateOrderExcel(orderData);
        
        // Show success message
        showSuccessMessage();
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();
        
        // Reset form
        document.getElementById('orderForm').reset();
        
        // Close modal after delay
        setTimeout(() => {
            closeOrderModal();
        }, 2000);
        
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('There was an error processing your order. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Order';
    }
}

// Generate Excel file with order data
async function generateOrderExcel(orderData) {
    // Create order data for Excel
    const orderSummary = {
        'Order Number': orderData.orderNumber,
        'Date & Time': orderData.orderDate,
        'Customer Name': orderData.customerName,
        'Phone': orderData.customerPhone,
        'Email': orderData.customerEmail,
        'Order Type': orderData.orderType,
        'Delivery Address': orderData.deliveryAddress,
        'Special Instructions': orderData.specialInstructions
    };
    
    // Prepare items data
    const itemsData = orderData.items.map(item => ({
        'Item Name': item.name,
        'Category': item.category,
        'Price (₹)': item.price,
        'Quantity': item.quantity,
        'Subtotal (₹)': item.price * item.quantity
    }));
    
    // Send to backend for Excel generation
    const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderSummary: orderSummary,
            items: itemsData
        })
    });
    
    if (response.ok) {
        const result = await response.json();
        console.log('Order created:', result.orderNumber);
        // Note: Order is now added to master Excel file
        // No individual file download needed
    }
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('orderForm');
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <h3>✓ Order Placed Successfully!</h3>
        <p>Thank you for your order. We'll contact you shortly.</p>
    `;
    form.insertBefore(successMsg, form.firstChild);
    
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}
