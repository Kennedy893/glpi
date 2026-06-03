import React from 'react';
import { useFetchAllProducts } from '../hooks/useFetchAllProducts';
import { ProductCard } from '../components/product/ProductCard';
import '../assets/css/HomePage.css';

export function HomePage() {
  const { products, loading, error } = useFetchAllProducts();

  if (loading) {
    return <div className="state-message">Chargement du catalogue PrestaShop...</div>;
  }
  
  if (error) {
    return <div className="state-message error-message">Erreur : {error}</div>;
  }

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Notre Boutique PrestaShop</h1>
      
      {products.length === 0 ? (
        <p className="state-message">Aucun produit disponible pour le moment.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}