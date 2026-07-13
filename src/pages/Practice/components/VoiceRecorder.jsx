import { useState, useEffect } from 'react';

const VoiceRecorder = ({ 
  isListening, 
  transcript, 
  confidence, 
  onStart, 
  onStop, 
  isSupported,
  targetText 
}) => {
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const handleStartRecording = () => {
    setIsCountingDown(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      onStart();
    }
  }, [isCountingDown, countdown, onStart]);

  if (!isSupported) {
    return (
      <div className="voice-recorder unsupported">
        <div className="warning-icon">⚠️</div>
        <p className="warning-text">您的浏览器不支持语音识别功能</p>
        <p className="warning-hint">建议使用 Chrome 或 Edge 浏览器</p>
      </div>
    );
  }

  return (
    <div className="voice-recorder">
      {isCountingDown ? (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
          <p className="countdown-text">准备录音...</p>
        </div>
      ) : null}

      <div className="recording-target">
        <p className="target-label">请跟读：</p>
        <p className="target-text">{targetText}</p>
      </div>

      <div className="recorder-control">
        <button
          className={`record-btn ${isListening ? 'recording' : ''}`}
          onClick={isListening ? onStop : handleStartRecording}
          disabled={isCountingDown}
        >
          <span className="mic-icon">{isListening ? '⏹️' : '🎙️'}</span>
          <span className="btn-text">{isListening ? '停止录音' : '开始录音'}</span>
        </button>

        {isListening && (
          <div className="recording-status">
            <div className="pulse-ring"></div>
            <span className="status-text">正在录音...</span>
          </div>
        )}
      </div>

      {transcript && (
        <div className="recognition-result">
          <p className="result-label">识别结果：</p>
          <p className="result-text">{transcript}</p>
          <p className="confidence-text">置信度：{Math.round(confidence * 100)}%</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
