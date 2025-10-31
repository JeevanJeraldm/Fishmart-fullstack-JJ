// backend/routes/orders.js
const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

// 🧾 Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product')
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error while fetching orders' })
  }
})

// 🛒 Place a new order
router.post('/', async (req, res) => {
  try {
    const { user, products, totalAmount } = req.body

    if (!user || !products || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const order = new Order({
      user,
      products,
      totalAmount,
    })

    await order.save()
    res.status(201).json(order)
  } catch (err) {
    console.error('Order creation error:', err)
    res.status(500).json({ message: 'Server error while placing order' })
  }
})

module.exports = router
