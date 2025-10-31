const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['seawater', 'freshwater', 'misc'],
    required: true
  },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  cuts: [
    {
      name: { type: String, required: true },
      extraCost: { type: Number, default: 0 },
      note: { type: String }
    }
  ],
  usages: [{ type: String }],
  images: [{ type: String }],
  stock: { type: Number, default: 100 }
});

module.exports = mongoose.model('Product', productSchema);
