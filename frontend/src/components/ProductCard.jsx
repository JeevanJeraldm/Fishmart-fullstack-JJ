import React from 'react';

export default function ProductCard({ product, onSelect }) {
  return (
    <div className="product-card" onClick={() => onSelect(product)} role="button">
      <div className="card-image">
        <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} />
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="muted">{product.category}</p>
        <div className="price-row">
          <strong>₹{product.price.toFixed(2)}</strong>
          <button
            className="btn-small"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
