const express = require('express');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('✓ Created data directory');
}

// Orders file path
const ORDERS_FILE = path.join(DATA_DIR, 'orders.xlsx');
const STATS_FILE = path.join(DATA_DIR, 'order-stats.json');

// Initialize stats file if it doesn't exist
function initializeStats() {
    if (!fs.existsSync(STATS_FILE)) {
        const stats = {
            totalOrders: 0,
            totalRevenue: 0,
            orders: [],
            pendingOrders: []
        };
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    }
}

// Load stats
function loadStats() {
    initializeStats();
    return JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
}

// Save stats
function saveStats(stats) {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

// Initialize the master Excel file
async function initializeExcelFile() {
    if (fs.existsSync(ORDERS_FILE)) {
        return; // File already exists
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Orders');

    // Set column widths
    worksheet.columns = [
        { width: 20 }, // Order Number
        { width: 18 }, // Date & Time
        { width: 20 }, // Customer Name
        { width: 15 }, // Phone
        { width: 25 }, // Email
        { width: 12 }, // Order Type
        { width: 30 }, // Delivery Address
        { width: 35 }, // Items
        { width: 30 }, // Special Instructions
        { width: 12 }, // Total Amount
        { width: 12 }  // Status
    ];

    // Add restaurant header
    worksheet.mergeCells('A1:K1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'TRITON RESTAURANT - MASTER ORDER LOG';
    titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FF2B4162' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF5F1E8' }
    };
    worksheet.getRow(1).height = 35;

    // Add tagline
    worksheet.mergeCells('A2:K2');
    const taglineCell = worksheet.getCell('A2');
    taglineCell.value = 'Where Mediterranean heritage meets global flavors';
    taglineCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF6B6B6B' } };
    taglineCell.alignment = { horizontal: 'center' };
    worksheet.getRow(2).height = 20;

    // Add headers
    const headers = [
        'Order Number',
        'Date & Time',
        'Customer Name',
        'Phone',
        'Email',
        'Order Type',
        'Delivery Address',
        'Items Ordered',
        'Special Instructions',
        'Total (₹)',
        'Status'
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD4AF37' }
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    // Add borders to header
    headerRow.eachCell((cell) => {
        cell.border = {
            top: { style: 'medium' },
            left: { style: 'thin' },
            bottom: { style: 'medium' },
            right: { style: 'thin' }
        };
    });

    await workbook.xlsx.writeFile(ORDERS_FILE);
    console.log('✓ Master Excel file initialized');
}

// API endpoint to create order
app.post('/api/create-order', async (req, res) => {
    try {
        const { orderSummary, items } = req.body;

        // Load existing workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(ORDERS_FILE);
        const worksheet = workbook.getWorksheet('All Orders');

        // Format items for the cell
        const itemsText = items.map(item => 
            `${item['Item Name']} (${item.Category}) - Qty: ${item.Quantity} × ₹${item['Price (₹)']} = ₹${item['Subtotal (₹)']}`
        ).join('\n');

        // Calculate total
        const total = items.reduce((sum, item) => sum + item['Subtotal (₹)'], 0);

        // Add new row with status
        const newRow = worksheet.addRow([
            orderSummary['Order Number'],
            orderSummary['Date & Time'],
            orderSummary['Customer Name'],
            orderSummary['Phone'],
            orderSummary['Email'],
            orderSummary['Order Type'].toUpperCase(),
            orderSummary['Delivery Address'],
            itemsText,
            orderSummary['Special Instructions'],
            total,
            'PENDING' // Status column
        ]);

        // Format the new row
        const rowNumber = newRow.number;
        
        // Alternate row colors
        if (rowNumber % 2 === 0) {
            newRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF5F1E8' }
            };
        }

        // Wrap text for items and special instructions
        worksheet.getCell(`H${rowNumber}`).alignment = { wrapText: true, vertical: 'top' };
        worksheet.getCell(`I${rowNumber}`).alignment = { wrapText: true, vertical: 'top' };
        
        // Center align order type and total
        worksheet.getCell(`F${rowNumber}`).alignment = { horizontal: 'center' };
        worksheet.getCell(`J${rowNumber}`).alignment = { horizontal: 'right' };
        worksheet.getCell(`J${rowNumber}`).font = { bold: true };
        
        // Status column - green background for pending
        worksheet.getCell(`K${rowNumber}`).alignment = { horizontal: 'center' };
        worksheet.getCell(`K${rowNumber}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getCell(`K${rowNumber}`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFA500' } // Orange for pending
        };

        // Add borders
        newRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFE8DFD0' } },
                left: { style: 'thin', color: { argb: 'FFE8DFD0' } },
                bottom: { style: 'thin', color: { argb: 'FFE8DFD0' } },
                right: { style: 'thin', color: { argb: 'FFE8DFD0' } }
            };
        });

        // Set row height
        newRow.height = 60;

        // Save the workbook
        await workbook.xlsx.writeFile(ORDERS_FILE);

        // Update stats - add to both orders and pendingOrders
        const stats = loadStats();
        stats.totalOrders += 1;
        stats.totalRevenue += total;
        
        const orderData = {
            orderNumber: orderSummary['Order Number'],
            date: orderSummary['Date & Time'],
            customerName: orderSummary['Customer Name'],
            phone: orderSummary['Phone'],
            email: orderSummary['Email'],
            total: total,
            orderType: orderSummary['Order Type'],
            items: items,
            specialInstructions: orderSummary['Special Instructions'],
            deliveryAddress: orderSummary['Delivery Address'],
            status: 'pending',
            rowNumber: rowNumber // Track Excel row number
        };
        
        stats.orders.push(orderData);
        stats.pendingOrders.push(orderData);
        saveStats(stats);

        console.log(`✓ Order added: ${orderSummary['Order Number']} - ₹${total}`);

        // Send success response
        res.json({
            success: true,
            message: 'Order added successfully',
            orderNumber: orderSummary['Order Number']
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get pending orders (for kitchen/dashboard)
app.get('/api/pending-orders', (req, res) => {
    try {
        const stats = loadStats();
        res.json(stats.pendingOrders || []);
    } catch (error) {
        console.error('Error getting pending orders:', error);
        res.status(500).json({ error: 'Failed to get pending orders' });
    }
});

// Mark order as finished
app.post('/api/finish-order', async (req, res) => {
    try {
        const { orderNumber } = req.body;
        
        // Load stats
        const stats = loadStats();
        
        // Find the order in pending orders
        const orderIndex = stats.pendingOrders.findIndex(o => o.orderNumber === orderNumber);
        
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const order = stats.pendingOrders[orderIndex];
        
        // Update Excel file - change status to COMPLETED
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(ORDERS_FILE);
        const worksheet = workbook.getWorksheet('All Orders');
        
        // Find the row with this order number
        let rowToUpdate = null;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 3 && row.getCell(1).value === orderNumber) {
                rowToUpdate = row;
            }
        });
        
        if (rowToUpdate) {
            const statusCell = rowToUpdate.getCell(11); // Column K (Status)
            statusCell.value = 'COMPLETED';
            statusCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            statusCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF28A745' } // Green for completed
            };
            
            await workbook.xlsx.writeFile(ORDERS_FILE);
        }
        
        // Remove from pending orders
        stats.pendingOrders.splice(orderIndex, 1);
        
        // Update the status in the main orders array
        const mainOrderIndex = stats.orders.findIndex(o => o.orderNumber === orderNumber);
        if (mainOrderIndex !== -1) {
            stats.orders[mainOrderIndex].status = 'completed';
        }
        
        saveStats(stats);
        
        console.log(`✓ Order completed: ${orderNumber}`);
        
        res.json({
            success: true,
            message: 'Order marked as finished',
            orderNumber: orderNumber
        });
        
    } catch (error) {
        console.error('Error finishing order:', error);
        res.status(500).json({ error: 'Failed to finish order' });
    }
});

// Get statistics
app.get('/api/stats', (req, res) => {
    try {
        const stats = loadStats();
        
        // Calculate today's orders and revenue
        const today = new Date().toDateString();
        const todayOrders = stats.orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.toDateString() === today;
        });
        
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

        res.json({
            totalOrders: stats.totalOrders,
            totalRevenue: stats.totalRevenue,
            todayOrders: todayOrders.length,
            todayRevenue: todayRevenue,
            pendingOrdersCount: stats.pendingOrders?.length || 0,
            recentOrders: stats.orders.slice(-10).reverse() // Last 10 orders
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// Download the master Excel file
app.get('/api/download-orders', (req, res) => {
    if (fs.existsSync(ORDERS_FILE)) {
        res.download(ORDERS_FILE, 'triton-all-orders.xlsx');
    } else {
        res.status(404).json({ error: 'Orders file not found' });
    }
});

// Get recent orders for display
app.get('/api/recent-orders', (req, res) => {
    try {
        const stats = loadStats();
        res.json(stats.orders.slice(-20).reverse()); // Last 20 orders, newest first
    } catch (error) {
        console.error('Error getting recent orders:', error);
        res.status(500).json({ error: 'Failed to get recent orders' });
    }
});

// Initialize on startup
(async () => {
    try {
        initializeStats();
        await initializeExcelFile();
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🍽️  Triton Restaurant Order System`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`🌐 Server running on: http://localhost:${PORT}`);
            console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin-orders.html`);
            console.log(`📋 Menu & Ordering: http://localhost:${PORT}/menu-with-cart.html`);
            console.log(`📁 Orders saved to: ${ORDERS_FILE}`);
            console.log(`📁 Stats saved to: ${STATS_FILE}`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
})();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n⚠️  Server stopped by user');
    process.exit(0);
});
