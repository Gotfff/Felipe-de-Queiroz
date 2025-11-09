import React, { useState, useRef, useMemo, useCallback } from 'react';

// Components
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import AiAssistant from './components/AiAssistant';
import ShoppingCart from './components/ShoppingCart';
import ProductDetailModal from './components/ProductDetailModal';
import Footer from './components/Footer';
import Toast from './components/Toast';
import BackgroundParticles from './components/effects/BackgroundParticles';
import FilterModal from './components/FilterModal';
import FloatingCart3D from './components/FloatingCart3D';
import VoiceControl from './components/voice/VoiceControl';
import VoiceFeedback from './components/voice/VoiceFeedback';

// Data, Types and Services
import { PRODUCTS } from './constants';
import type { Product, CartItem, AiAssistantRef } from './types';
import { VoiceControlService } from './services/voiceService';

function App() {
  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [currentCategory, setCurrentCategory] = useState('Todos');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');

  // Refs
  const aiAssistantRef = useRef<AiAssistantRef>(null);
  const aiSectionRef = useRef<HTMLDivElement>(null);
  const collectionsSectionRef = useRef<HTMLDivElement>(null);

  // Cart Logic
  const handleAddToCart = useCallback((product: Product) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setToastMessage(`${product.name} adicionado ao carrinho!`);
  }, []);

  const handleUpdateQuantity = useCallback((productId: number, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Modal Logic
  const handleCheckout = useCallback(() => {
    if (cartItems.length > 0) {
      setIsCartOpen(false);
      setIsPaymentModalOpen(true);
    }
  }, [cartItems]);

  const handlePaymentSuccess = useCallback(() => {
    setIsPaymentModalOpen(false);
    setCartItems([]);
    setToastMessage('Pagamento concluído! Obrigado por comprar na FuturoWear.');
  }, []);
  
  const handleOpenCart = useCallback(() => setIsCartOpen(true), []);
  const handleCloseCart = useCallback(() => setIsCartOpen(false), []);
  const handleClosePaymentModal = useCallback(() => setIsPaymentModalOpen(false), []);
  const handleProductSelect = useCallback((product: Product) => setSelectedProduct(product), []);
  const handleCloseProductDetail = useCallback(() => setSelectedProduct(null), []);

  // Filtering Logic
  const categories = useMemo(() => ['Todos', ...new Set(PRODUCTS.map(p => p.category))], []);
  
  const handleCategoryChange = useCallback((category: string) => {
    setCurrentCategory(category);
    setIsFilterModalOpen(false);
  }, []);

  const filteredProducts = useMemo(() => {
    if (currentCategory === 'Todos') {
      return PRODUCTS;
    }
    return PRODUCTS.filter(p => p.category === currentCategory);
  }, [currentCategory]);

  // Navigation
  const handleScrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Voice Control Service
  const voiceService = useMemo(() => {
      if (typeof window === 'undefined') {
          return null;
      }
      const callbacks = {
          onAddToCart: handleAddToCart,
          onOpenCart: () => setIsCartOpen(true),
          onCloseCart: () => setIsCartOpen(false),
          onCheckout: handleCheckout,
          onConsultAI: () => {
              if (aiAssistantRef.current) {
                  handleScrollTo(aiSectionRef);
                  aiAssistantRef.current.generate();
              }
          },
      };
      return new VoiceControlService(PRODUCTS, callbacks, setIsListening, setVoiceFeedback);
  }, [handleAddToCart, handleCheckout]);

  const handleStartListening = useCallback(() => {
      if (voiceService) {
          voiceService.startListening();
      }
  }, [voiceService]);

  return (
    <div className="App">
      <BackgroundParticles />
      <Header 
        onCollectionsClick={() => handleScrollTo(collectionsSectionRef)}
        onAiStyleClick={() => handleScrollTo(aiSectionRef)}
        onToggleFilter={() => setIsFilterModalOpen(true)}
      />
      <main>
        <div ref={collectionsSectionRef}>
            <ProductGrid 
                products={filteredProducts} 
                onAddToCart={handleAddToCart}
                onProductSelect={handleProductSelect}
            />
        </div>
        <div ref={aiSectionRef}>
            <AiAssistant ref={aiAssistantRef}/>
        </div>
      </main>
      <Footer />

      <ShoppingCart 
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
        isPaymentModalOpen={isPaymentModalOpen}
        onClosePaymentModal={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <ProductDetailModal 
        product={selectedProduct}
        onClose={handleCloseProductDetail}
        onAddToCart={handleAddToCart}
      />
      
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categories={categories}
        selectedCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />

      <Toast 
        message={toastMessage} 
        onClose={() => setToastMessage('')} 
      />

      <FloatingCart3D 
        itemCount={cartItemCount}
        onClick={handleOpenCart}
      />
      
      <VoiceControl
        onStartListening={handleStartListening}
        isListening={isListening}
      />
      
      <VoiceFeedback 
        feedback={voiceFeedback}
        isListening={isListening}
      />
    </div>
  );
}

export default App;