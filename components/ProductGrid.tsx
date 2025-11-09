import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductSelect: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onProductSelect }) => {
  return (
    <section className="products" id="products">
      <h2 className="section-title">Coleção Neural 2085</h2>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
            onProductSelect={onProductSelect} 
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;