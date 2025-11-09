import React from 'react';
import { CloseIcon } from './icons/Icons';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  // The parent's onCategoryChange function already closes the modal,
  // so we don't need to call onClose here as well.
  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className={`modal ${isOpen ? 'open' : ''}`} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
    >
      <div className="modal-content filter-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close" aria-label="Fechar filtros">
          <CloseIcon style={{ width: '24px', height: '24px' }} />
        </button>
        <h2 id="filter-modal-title">Filtrar por Categoria</h2>
        <div className="filter-options">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
