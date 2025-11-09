import React from 'react';
import type { Product } from '../types';
import { CloseIcon, ARIcon } from './icons/Icons';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) {
    return null;
  }
  
  const handleAddToCartClick = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className={`modal ${product ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content product-detail" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close" aria-label="Fechar detalhes do produto">
          <CloseIcon style={{width: '24px', height: '24px'}} />
        </button>
        <div className="product-detail-content">
          <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
          <div className="product-detail-info">
            <div className="product-category-badge">{product.category}</div>
            <h2>{product.name}</h2>
            <div className="price">R${product.price.toFixed(2)}</div>
            <p className="product-description">{product.description}</p>
            <div className="product-detail-actions">
              {product.modelUrl && (
                <a href={product.modelUrl} rel="ar" className="ar-btn">
                  <ARIcon />
                  Provar em AR
                </a>
              )}
              <button className="add-to-cart" onClick={handleAddToCartClick}>
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;