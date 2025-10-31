import React, { useEffect, useState, useContext } from "react";
import { useAuth } from '../contexts/AuthContext'


const Cart = () => {
  const { user, refreshCartCount } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [success, setSuccess] = useState(false);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/cart");
      const data = await res.json();
      console.log("Cart API response:", data);

      if (data.items) {
        setCartItems(data.items);
        setCartTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Calculate subtotal manually
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // ✅ Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      const data = await response.json();
      setCartItems(data.items);
      setCartTotal(data.total);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // ✅ Remove item
  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Failed to remove item");

      const data = await response.json();
      setCartItems(data.items);
      setCartTotal(data.total);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // ✅ Place order and save to MongoDB
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty.");

    try {
      const orderData = {
        user: user?._id || "guest",
        products: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        totalAmount: cartTotal || calculateSubtotal(),
      };

      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to place order");

      const data = await response.json();
      console.log("Order saved:", data);
      setSuccess(true);

      // 🧹 Clear cart after success
      await fetch("http://localhost:5001/api/cart", { method: "DELETE" });
      setCartItems([]);
      setCartTotal(0);

      alert("✅ Order placed successfully!");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("❌ Failed to place order");
    }
  };

  // ✅ Render
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 mb-4"
            >
              <div className="flex items-center gap-4">
  <img
  src={
    item.imageUrl
      ? item.imageUrl
      : item.images && item.images.length > 0
      ? item.images[0]
      : "/placeholder.jpg"
  }
  alt={item.name}
  className="w-20 h-20 object-cover rounded-lg"
/>
  <div>
    <h3 className="text-lg font-semibold">{item.name}</h3>
    <p className="text-gray-600">₹{item.price}</p>
  </div>
</div>


              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemoveItem(item._id)}
                className="text-red-500 font-semibold"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <h3 className="text-xl font-semibold mb-4">
              Total: ₹{cartTotal || calculateSubtotal()}
            </h3>
            <button
              onClick={handlePlaceOrder}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
