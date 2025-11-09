import React from 'react';
import { MicrophoneIcon } from '../icons/Icons';

interface VoiceControlProps {
  onStartListening: () => void;
  isListening: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onStartListening, isListening }) => {
  return (
    <button
      className={`voice-control-btn ${isListening ? 'listening' : ''}`}
      onClick={onStartListening}
      aria-label="Ativar controle de voz"
      title="Ativar controle de voz"
    >
      <MicrophoneIcon />
    </button>
  );
};

export default VoiceControl;