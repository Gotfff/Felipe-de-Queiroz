import React from 'react';
import { GithubIcon, TwitterIcon, LinkedInIcon } from './icons/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo">Futuro<span>Wear</span></div>
        <p>© {new Date().getFullYear()} FuturoWear. Todos os direitos reservados. Moda para a próxima dimensão.</p>
        <div className="social-links">
          <a href="#" aria-label="GitHub"><GithubIcon /></a>
          <a href="#" aria-label="Twitter"><TwitterIcon /></a>
          <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
