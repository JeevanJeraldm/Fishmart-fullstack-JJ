const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

let cart = []; // 🧺 In-memory cart (temporary)

// 🛒 Get all cart items
router.get('/', (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total });
});

// ➕ Add product to cart
router.post('/', async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId).select('name price images');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = cart.find((item) => item._id.toString() === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || '', // ✅ handle array field safely
        quantity: 1,
      });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ message: 'Added to cart', items: cart, total });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

// 🆙 Update quantity
router.put('/', (req, res) => {
  const { productId, quantity } = req.body;
  const item = cart.find((i) => i._id.toString() === productId);

  if (item) item.quantity = Math.max(1, quantity);
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  res.json({ message: 'Quantity updated', items: cart, total });
});

// ➖ Remove item from cart
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  cart = cart.filter((item) => item._id.toString() !== id);
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  res.json({ message: 'Removed from cart', items: cart, total });
});

// 🧹 Clear entire cart
router.delete('/', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared', items: [], total: 0 });
});

module.exports = router;
