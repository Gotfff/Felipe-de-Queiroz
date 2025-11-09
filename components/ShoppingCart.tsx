import React, { useState, useEffect } from 'react';
import type { CartItem } from '../types';
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from './icons/Icons';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onCheckout: () => void;
  isPaymentModalOpen: boolean;
  onClosePaymentModal: () => void;
  onPaymentSuccess: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onCheckout,
  isPaymentModalOpen,
  onClosePaymentModal,
  onPaymentSuccess
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [paymentStatus, setPaymentStatus] = useState('Processando...');

  useEffect(() => {
    if (isPaymentModalOpen) {
      setPaymentStatus('Processando...');
    }
  }, [isPaymentModalOpen]);
  
  const handleSimulatePayment = () => {
    setPaymentStatus('Pagamento Aprovado!');
    setTimeout(() => {
        onPaymentSuccess();
    }, 1500);
  };

  return (
    <>
      {/* Cart Modal */}
      <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <button onClick={onClose} className="close" aria-label="Fechar carrinho">
            <CloseIcon style={{width: '24px', height: '24px'}} />
          </button>
          <h2>Carrinho Neural</h2>
          <div id="cart-items">
            {cartItems.length === 0 ? (
              <p style={{textAlign: 'center'}}>Seu carrinho está vazio.</p>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1 }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '4px' }}/>
                    <div>
                        <strong>{item.name}</strong>
                        <div style={{ fontSize: '0.9em', color: '#aaa' }}>R${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} aria-label="Diminuir quantidade">
                      <MinusIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                    <span>{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} aria-label="Aumentar quantidade">
                      <PlusIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button className="trash-btn" onClick={() => onUpdateQuantity(item.id, 0)} style={{marginLeft: '0.5rem'}} aria-label="Remover do carrinho">
                      <TrashIcon style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <>
              <div className="total">Total: <strong>R${subtotal.toFixed(2)}</strong></div>
              <button className="checkout-btn" onClick={onCheckout}>Ir para Pagamento</button>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <div className={`modal ${isPaymentModalOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <button onClick={onClosePaymentModal} className="close" aria-label="Fechar pagamento">
            <CloseIcon style={{width: '24px', height: '24px'}} />
          </button>
          <h2>Pagamento Neural</h2>
          <p style={{textAlign: 'center'}}><em>Escaneie sua íris para confirmar...</em></p>
          <div className="payment-animation">
            <div className="scanner"></div>
          </div>
          <p id="payment-status" style={{textAlign: 'center', margin: '1rem 0'}}>{paymentStatus}</p>
          {paymentStatus === 'Processando...' && (
             <button className="confirm-btn" onClick={handleSimulatePayment}>Simular Pagamento</button>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;