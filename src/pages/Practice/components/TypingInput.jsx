import { useState } from 'react';

const TypingInput = ({ options, onSubmit, onSelectOption, showHint }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  const handleOptionClick = (option) => {
    onSelectOption(option);
  };

  return (
    <div className="typing-input">
      {options && options.length > 0 && (
        <div className="options-container">
          <p className="options-label">选择或输入答案：</p>
          <div className="options-grid">
            {options.map((option, index) => (
              <button
                key={option.id}
                className="option-btn"
                onClick={() => handleOptionClick(option)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="option-text">{option.text}</span>
                <span className="option-translation">{option.translation}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          className="text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入你的回答..."
          autoFocus
        />
        <div className="input-actions">
          {showHint && (
            <button type="button" className="hint-btn">
              💡 提示
            </button>
          )}
          <button type="submit" className="submit-btn" disabled={!input.trim()}>
            提交
          </button>
        </div>
      </form>
    </div>
  );
};

export default TypingInput;
