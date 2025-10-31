// backend/controllers/orderController.js
const Order = require('../models/Order');

// ✅ Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Place an order
exports.placeOrder = async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body;

    const order = new Order({
      user,
      products,
      totalAmount,
      status: 'Pending',
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
