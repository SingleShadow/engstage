const ModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'typing', icon: '⌨️', label: '打字跟练', description: '通过打字练习对话' },
    { id: 'voice', icon: '🎤', label: '语音跟练', description: '通过录音练习发音' }
  ];

  return (
    <div className="mode-selector">
      <h3 className="selector-title">选择练习模式</h3>
      <div className="modes-container">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`mode-btn ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-label">{mode.label}</span>
            <span className="mode-description">{mode.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;
