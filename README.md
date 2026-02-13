# Triton Restaurant - Complete Ordering System v3.0

A professional kitchen management and ordering system for Triton Restaurant.

## 🎯 Features Overview

### ✅ Customer Features
- **Interactive Menu** - Browse all categories with shopping cart
- **Real-time Cart** - Add/remove items, adjust quantities
- **Order Form** - Customer details, order type, special instructions
- **Order Confirmation** - Instant confirmation after placing order

### ✅ Kitchen/Admin Features
- **Live Dashboard** - See pending orders in real-time
- **Order Cards** - Full order details at a glance
- **Finish Button** - Mark orders complete with one click
- **Master Excel File** - All orders (pending & completed) in one file
- **Revenue Tracking** - Total and daily revenue auto-calculated
- **Status Tracking** - Pending (orange) vs Completed (green) in Excel

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Start Server
```bash
npm start
```

### Access URLs
- **Homepage:** http://localhost:3000/index.html
- **Menu (Order):** http://localhost:3000/menu-with-cart.html
- **Kitchen Dashboard:** http://localhost:3000/admin-orders.html

## 📊 How It Works

### Customer Journey:
1. **Browse Menu** → Click items to add to cart
2. **Review Cart** → Click cart icon (🛒), adjust quantities
3. **Place Order** → Click "Place Order", fill details
4. **Confirmation** → See success message

### Kitchen Workflow:
1. **New Order Arrives** → Shows on dashboard automatically
2. **View Details** → See items, customer info, special instructions
3. **Prepare Order** → Cook the items
4. **Finish** → Click "✓ Mark as Finished" button
5. **Order Clears** → Removed from dashboard, marked complete in Excel

## 📋 Kitchen Dashboard

### Statistics (Top Cards):
- 🔥 **Pending Orders** - Orders waiting to be finished (highlighted in orange)
- 📦 **Total Orders** - All time order count
- 📅 **Today's Orders** - Orders placed today
- 💰 **Total Revenue** - All time earnings
- 💵 **Today's Revenue** - Today's earnings

### Pending Orders Display:
Each order card shows:
- **Order Number** (e.g., TRI-1707912345678)
- **Date & Time** of order
- **Customer Name**
- **Phone Number**
- **Email** (if provided)
- **Order Type** badge (Dine-in/Takeaway/Delivery)
- **Delivery Address** (if delivery)
- **Items List** with quantities
- **Special Instructions** (if any)
- **Total Amount** in large green text
- **✓ Mark as Finished** button

### Actions:
- **🔄 Refresh** - Manually refresh orders
- **📥 Download All Orders** - Get complete Excel file
- **Auto-refresh** - Updates every 10 seconds automatically

## 📁 Files Generated

### `orders.xlsx` (Master File)
All orders in one Excel file with columns:
1. Order Number
2. Date & Time
3. Customer Name
4. Phone
5. Email
6. Order Type
7. Delivery Address
8. Items Ordered (formatted list)
9. Special Instructions
10. Total (₹)
11. **Status** (PENDING or COMPLETED)

**Color Coding:**
- **Orange background** = PENDING
- **Green background** = COMPLETED

### `order-stats.json` (Statistics)
Tracks:
- Total orders count
- Total revenue
- All orders data
- Pending orders (live list)

## 🎨 Visual Example

### Kitchen Dashboard View:
```
┌─────────────────────────────────────────┐
│  Order: TRI-1707912345678               │
│  Time: 2/13/2026, 2:30 PM               │
├─────────────────────────────────────────┤
│  👤 Raj Patel                           │
│  📞 9876543210                          │
│  🏷️ DINE-IN                             │
├─────────────────────────────────────────┤
│  📋 Items:                              │
│  • Classic Margherita × 1               │
│  • Latte × 2                            │
│  • Gulab Jamun with Ice Cream × 1       │
├─────────────────────────────────────────┤
│  ⚠️ Special Instructions                │
│  Please make pizza extra crispy         │
├─────────────────────────────────────────┤
│         ₹1,560                          │
│                                         │
│  [✓ Mark as Finished]                   │
└─────────────────────────────────────────┘
```

## 🔄 Order Lifecycle

```
1. CUSTOMER PLACES ORDER
   ↓
2. ADDED TO EXCEL (Status: PENDING)
   ↓
3. APPEARS ON KITCHEN DASHBOARD
   ↓
4. CHEF PREPARES ORDER
   ↓
5. CHEF CLICKS "MARK AS FINISHED"
   ↓
6. EXCEL UPDATED (Status: COMPLETED)
   ↓
7. REMOVED FROM DASHBOARD
   ↓
8. STAYS IN EXCEL FOR RECORDS
```

## 📱 Mobile Responsive

Works perfectly on:
- Desktop computers (kitchen displays)
- Tablets (waiter stations)
- Mobile phones (customer orders)

## 🔧 Technical Details

### File Structure:
```
triton-restaurant/
├── index.html              # Homepage
├── menu-with-cart.html     # Menu with cart
├── admin-orders.html       # Kitchen dashboard
├── styles.css              # Main styles
├── cart-styles.css         # Cart styles
├── script.js               # Navigation JS
├── cart.js                 # Cart functionality
├── server.js               # Node.js backend
├── package.json            # Dependencies
├── orders.xlsx             # Master file (auto-created)
├── order-stats.json        # Statistics (auto-created)
└── assets/images/          # Images
```

### Technologies:
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Excel:** ExcelJS library
- **Storage:** File system + localStorage

## 💡 Key Improvements from v2.0

### What's New:
1. ✅ **Pending orders shown on dashboard** (not just in Excel)
2. ✅ **Finish button** to complete orders
3. ✅ **Order cards** with full details
4. ✅ **Status column** in Excel (PENDING/COMPLETED)
5. ✅ **Auto-refresh** every 10 seconds
6. ✅ **Pending orders counter** highlighted
7. ✅ **No downloads needed** to see orders

### What Stayed:
- Single master Excel file
- Revenue tracking
- Cart functionality
- Order form
- Professional formatting

## 🎯 Use Cases

### During Rush Hours:
- Kitchen sees all pending orders at once
- Prioritize based on order time
- Clear completed orders quickly

### End of Day:
- Download Excel file
- See all orders (pending + completed)
- Review daily revenue
- Archive for records

### Delivery Orders:
- Delivery address clearly visible
- Special instructions highlighted
- Mark finished when handed to driver

## 🛠️ Customization

### Change Auto-Refresh Time:
In `admin-orders.html`, line ~XXX:
```javascript
refreshInterval = setInterval(loadOrders, 10000); // 10 seconds
// Change to 5000 for 5 seconds, 30000 for 30 seconds, etc.
```

### Change Port:
In `server.js`, line 6:
```javascript
const PORT = 3000; // Change to 8080, 3001, etc.
```

### Customize Colors:
In `admin-orders.html` `<style>` section:
- Pending highlight: `#ff9800` (orange)
- Completed: `#28a745` (green)
- Primary: `var(--primary-navy)`

## 🐛 Troubleshooting

### Orders not appearing on dashboard:
1. Check server is running
2. Press F12 → Console for errors
3. Click Refresh button
4. Check network connection

### Finish button not working:
1. Check server console for errors
2. Verify Excel file is not open in Excel
3. Check file permissions
4. Restart server

### Revenue not updating:
1. Check `order-stats.json` exists
2. Delete `order-stats.json` and restart (will rebuild)
3. Verify orders are being saved

### Excel file errors:
1. Close Excel if file is open
2. Check write permissions
3. Delete `orders.xlsx` (will recreate)
4. Restart server

## 📞 Support

**Restaurant Contact:**
- Email: hello@tritonrestaurant.com
- Phone: +91 9510605053

**Technical Issues:**
- Check server console for error messages
- Verify all files are in place
- Ensure Node.js is installed
- Try restarting the server

## 🔒 Data Security

- **Local Storage:** All data stored on your server
- **No Cloud:** No external dependencies
- **Backup:** Copy `orders.xlsx` and `order-stats.json` regularly
- **Privacy:** Customer data never leaves your system

## 🎉 Summary

### For Customers:
- Easy ordering from any device
- Shopping cart with live updates
- Multiple order types supported

### For Kitchen Staff:
- See all pending orders at a glance
- Full order details in cards
- One-click to mark finished
- Orders disappear when done

### For Management:
- Download complete order history anytime
- Track revenue (total and daily)
- Professional Excel records
- Easy to analyze and archive

## 📈 Future Enhancements (Optional)

Possible additions:
- **Order Notifications** - Sound/alert when new order arrives
- **Kitchen Printer** - Auto-print order tickets
- **Order Timer** - Show how long order has been pending
- **Multi-language** - Support for regional languages
- **SMS Notifications** - Alert customers when ready
- **Payment Integration** - Accept online payments

---

**Version:** 3.0  
**Last Updated:** February 2026  
**© 2026 Triton Restaurant. All rights reserved.**

Enjoy your complete kitchen management system! 🍽️👨‍🍳
