import { useState, useRef, useCallback, useEffect } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined';
    const SpeechRecognition = hasWindow && (window.SpeechRecognition || window.webkitSpeechRecognition);
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setIsLoading(false);
      return;
    }

    setIsSupported(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setConfidence(0);
        setError(null);
      };

      recognition.onresult = (event) => {
        try {
          const result = event.results[0][0];
          setTranscript(result.transcript);
          setConfidence(result.confidence);
        } catch (err) {
          console.error('Speech recognition result error:', err);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      return () => {
        try {
          recognition.abort();
        } catch (err) {
          console.error('Speech recognition cleanup error:', err);
        }
      };
    } catch (err) {
      console.error('Speech recognition initialization error:', err);
      setIsSupported(false);
    }
    setIsLoading(false);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('not-supported');
      console.warn('Speech recognition is not supported');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        setError(null);
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
        setError('start-failed');
        setIsListening(false);
      }
    }
  }, [isSupported, recognitionRef, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Speech recognition stop error:', err);
        setIsListening(false);
      }
    }
  }, [recognitionRef, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    isLoading
  };
};
