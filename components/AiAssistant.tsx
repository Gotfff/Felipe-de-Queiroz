import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { getStyleSuggestionStream } from '../services/geminiService';
import { SparklesIcon } from './icons/Icons';
import type { AiAssistantRef } from '../types';

const AiAssistant = forwardRef<AiAssistantRef>((props, ref) => {
  const [response, setResponse] = useState('Clique no botão para receber uma recomendação de estilo do nosso IA.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    const prompt = "Recomende um look para um evento de lançamento de tecnologia cyberpunk.";

    try {
      await getStyleSuggestionStream(prompt, (chunk) => {
        setResponse((prev) => prev + chunk);
      });
    } catch (err) {
      setError('Falha ao conectar com o mainframe. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    generate: handleGenerate,
  }));
  
  const formattedResponse = response
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- /gm, '&bull; ')
    .replace(/\n/g, '<br />');

  return (
    <section className="ai-recommendation" id="ai-recommendation">
      <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <SparklesIcon style={{ width: '28px', height: '28px' }}/>
        IA Style: Sua Próxima Peça
      </h2>
      <button className="cta-btn" onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'ANALISANDO...' : 'Consultar Stylist IA'}
      </button>
      <div id="ai-suggestion">
        {error && <p style={{color: 'red'}}>{error}</p>}
        {isLoading && !response && <p>Compilando Matriz de Estilo...</p>}
        <div dangerouslySetInnerHTML={{ __html: formattedResponse }} />
      </div>
    </section>
  );
});

export default AiAssistant;