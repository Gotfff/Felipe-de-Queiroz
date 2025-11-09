import React from 'react';
import { SparklesIcon, CollectionIcon, FilterIcon } from './icons/Icons';

interface HeaderProps {
  onCollectionsClick: () => void;
  onAiStyleClick: () => void;
  onToggleFilter: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onCollectionsClick, 
  onAiStyleClick,
  onToggleFilter
}) => {
  return (
    <header className="navbar">
      <div className="logo">Futuro<span>Wear</span></div>
      <nav>
        <button 
          className="nav-btn" 
          onClick={onCollectionsClick}
          aria-label="Coleções"
          title="Coleções"
        >
          <CollectionIcon style={{width: '28px', height: '28px'}} />
        </button>
        <button 
          className="nav-btn" 
          onClick={onAiStyleClick}
          aria-label="IA Style"
          title="IA Style"
        >
          <SparklesIcon style={{width: '28px', height: '28px'}} />
        </button>
        
        <button 
          className="nav-btn" 
          onClick={onToggleFilter}
          aria-label="Filtrar produtos"
          title="Filtrar produtos"
        >
          <FilterIcon style={{width: '28px', height: '28px'}} />
        </button>
      </nav>
    </header>
  );
};

export default Header;