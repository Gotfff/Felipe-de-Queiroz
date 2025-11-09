import React, { useMemo } from 'react';

const BackgroundParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const style = {
        '--size': `${Math.random() * 2 + 1}px`,
        '--x-start': `${Math.random() * 100}vw`,
        '--y-start': `${Math.random() * 100}vh`,
        '--x-end': `${Math.random() * 100}vw`,
        '--y-end': `${Math.random() * 100}vh`,
        animationDuration: `${Math.random() * 20 + 15}s`,
        animationDelay: `-${Math.random() * 35}s`,
      } as React.CSSProperties;
      return <div key={i} className="particle" style={style} />;
    });
  }, []);

  return <div className="particles-container">{particles}</div>;
};

export default BackgroundParticles;
