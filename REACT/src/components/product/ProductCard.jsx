import React from 'react';
import '../../assets/css/product/ProductCard.css';

export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img 
        className="product-image"
        src={product.imageUrl} 
        alt={product.name} 
      />
      <h3 className="product-title">{product.name}</h3>
      <p className="product-price">
        {product.getFormattedPrice()} {/* Utilisation de notre méthode POO */}
      </p>
      <button className="product-button">
        Voir le produit
      </button>
    </div>
  );
}