import React from 'react';
import { MicrophoneIcon } from '../icons/Icons';

interface VoiceFeedbackProps {
  feedback: string;
  isListening: boolean;
}

const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({ feedback, isListening }) => {
  const show = isListening || !!feedback;

  return (
    <div className={`voice-feedback ${show ? 'show' : ''} ${isListening ? 'listening' : ''}`}>
      <MicrophoneIcon className="voice-feedback-icon" />
      <p>{feedback || 'Ouvindo...'}</p>
    </div>
  );
};

export default VoiceFeedback;