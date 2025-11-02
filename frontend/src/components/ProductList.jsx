// frontend/src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext"; // ✅ Import context hook

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useAuth(); // ✅ use addToCart from context

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h2 className="text-4xl font-bold text-sky-800 mb-4">
          Fresh Fish & Seafood Delivered Daily
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Hand-picked from trusted suppliers and delivered fresh — ready for your grill, curry, or fry.
        </p>
      </section>

      {/* Products Grid */}
      <main className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 pb-20">
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all"
          >
            <img
  src={
    product.images && product.images[0]
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `https://fishmart-fullstack-jj.onrender.com${product.images[0]}`
      : "https://fishmart-fullstack-jj.onrender.com/uploads/default.jpg"
  }
  alt={product.name}
  className="w-full h-48 object-cover rounded"
/>

            <h3 className="text-lg font-bold text-sky-700">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-sky-600 font-semibold">₹{product.price}/kg</span>
              <button
                onClick={() => addToCart(product._id)} // ✅ uses context method
                className="bg-sky-500 hover:bg-sky-600 text-white py-1 px-3 rounded-lg text-sm transition"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
};

export default ProductList;
