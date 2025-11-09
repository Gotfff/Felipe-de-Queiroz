import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductSelect }) => {
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };
  
  return (
    <div className="product-card" onClick={() => onProductSelect(product)}>
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="product-img"
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="price">R${product.price.toFixed(2)}</div>
        <button 
          onClick={handleAddToCartClick}
          className="add-to-cart"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;