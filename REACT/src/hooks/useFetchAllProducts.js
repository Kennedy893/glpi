import { useState, useEffect } from 'react';
import { PrestaShopProductRepository } from '../infrastructure/repositories/PrestaShopProductRepository';

const productRepository = new PrestaShopProductRepository();

export function useFetchAllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    productRepository.getAllProducts()
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}