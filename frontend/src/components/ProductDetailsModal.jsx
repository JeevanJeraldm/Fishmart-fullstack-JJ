// frontend/src/components/ProductDetailsModal.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // adapt import path
import axios from 'axios';

export default function ProductDetailsModal({ product, onClose }) {
  const [selectedCut, setSelectedCut] = useState(product.cuts?.[0] || null);
  const [usage, setUsage] = useState(product.usages?.[0] || null);
  const [qty, setQty] = useState(1);
  const { user } = useContext(AuthContext);

  async function addToCart() {
    // For now store in localStorage or call API to create order (depends on your backend)
    const payload = {
      productId: product._id,
      cut: selectedCut,
      usage,
      qty,
      price: product.price + (selectedCut?.extraCost || 0)
    };
    // Example: store locally
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(payload);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-grid">
          <div className="left">
            <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} />
          </div>
          <div className="right">
            <h2>{product.name}</h2>
            <p className="muted">{product.description}</p>
            <p><strong>Base price:</strong> ₹{product.price.toFixed(2)}</p>

            <div className="option-group">
              <label>Cut style</label>
              <div className="chips">
                {product.cuts?.map((c,i)=>(
                  <button key={i} className={`chip ${selectedCut===c?'active':''}`}
                    onClick={()=>setSelectedCut(c)}>
                    {c.name}{c.extraCost?` (+₹${c.extraCost})`:''}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label>Usage</label>
              <div className="chips">
                {product.usages?.map((u,i)=>(
                  <button key={i} className={`chip ${usage===u?'active':''}`} onClick={()=>setUsage(u)}>{u}</button>
                ))}
              </div>
            </div>

            <div className="qty-row">
              <label>Qty</label>
              <input type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value))} />
            </div>

            <div className="actions">
              <button className="btn-primary" onClick={addToCart}>Add to cart</button>
              <button className="btn-outline" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
