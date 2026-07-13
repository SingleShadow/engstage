import { useCallback, useRef, useEffect, useState } from 'react';

export const useSpeechSynthesis = () => {
  const utteranceRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      window.speechSynthesis &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    );
  }, []);

  const speak = useCallback((text, rate = 1.0) => {
    if (!isSupported) {
      console.warn('Speech synthesis is not supported in this environment');
      return;
    }
    
    try {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = Math.min(Math.max(rate, 0.1), 2);
      utterance.pitch = 1;
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.error('Speech synthesis stop error:', error);
    }
  }, [isSupported]);

  const isSpeaking = useCallback(() => {
    if (!isSupported) return false;
    
    try {
      return window.speechSynthesis.speaking;
    } catch (error) {
      console.error('Speech synthesis isSpeaking error:', error);
      return false;
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
};
