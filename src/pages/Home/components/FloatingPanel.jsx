const FloatingPanel = ({ 
  selectedMode, 
  onModeChange, 
  onStartPractice, 
  currentScene 
}) => {
  return (
    <div className="floating-panel">
      <div className="panel-header">
        <span className="panel-icon">🎯</span>
        <span className="panel-title">当前选择</span>
      </div>
      <div className="panel-content">
        <div className="scene-info">
          <span className="scene-icon">{currentScene?.icon}</span>
          <span className="scene-name">{currentScene?.name}</span>
        </div>
        <div className="mode-section">
          <span className="mode-label">练习模式</span>
          <div className="mode-selector-container">
            <button
              className={`mode-btn ${selectedMode === 'typing' ? 'active' : ''}`}
              onClick={() => onModeChange('typing')}
            >
              <span className="mode-icon">⌨️</span>
              <span className="mode-text">打字跟练</span>
            </button>
            <button
              className={`mode-btn ${selectedMode === 'voice' ? 'active' : ''}`}
              onClick={() => onModeChange('voice')}
            >
              <span className="mode-icon">🎤</span>
              <span className="mode-text">语音跟练</span>
            </button>
          </div>
        </div>
        <button 
          className="practice-btn" 
          onClick={onStartPractice}
          disabled={!currentScene}
        >
          <span className="btn-text">开始练习</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingPanel;