// backend/controllers/cartController.js
const Product = require('../models/Product');

// Temporary in-memory cart (will later connect to DB per user)
let cart = [];

// ✅ Get Cart
exports.getCart = (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total });
};

// ✅ Add item to Cart
exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId).select('name price images');
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    const existing = cart.find(item => item._id.toString() === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      // ✅ Use first image from the array
      const imagePath =
        product.images && product.images.length > 0
          ? product.images[0]
          : '/uploads/default.jpg';

      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: imagePath, // unified field for frontend
        quantity: 1,
      });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ message: 'Added to cart', items: cart, total });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};


// ✅ Update quantity
exports.updateQuantity = (req, res) => {
  const { id, quantity } = req.body;
  const item = cart.find(i => i._id.toString() === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total });
};

// ✅ Remove item
exports.removeFromCart = (req, res) => {
  const { id } = req.params;
  cart = cart.filter(i => i._id.toString() !== id);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ message: 'Removed from cart', items: cart, total });
};
