const ResultFeedback = ({ result, onNext, onRetry, correctAnswer }) => {
  if (!result) return null;

  const { success, score, message } = result;

  return (
    <div className={`result-feedback ${success ? 'success' : 'error'}`}>
      <div className="result-icon">
        {success ? (
          <span className="success-icon">✅</span>
        ) : (
          <span className="error-icon">❌</span>
        )}
      </div>

      <div className="result-content">
        {success ? (
          <>
            <h3 className="result-title">回答正确！</h3>
            <p className="result-message">{message || '做得好！继续下一句吧。'}</p>
            {score !== undefined && score < 100 && (
              <p className="result-score">匹配度：{score}%</p>
            )}
          </>
        ) : (
          <>
            <h3 className="result-title">回答不正确</h3>
            <p className="result-message">{message || '再试一次吧！'}</p>
            {correctAnswer && (
              <div className="correct-answer">
                <p className="answer-label">正确答案：</p>
                <p className="answer-text">{correctAnswer.text}</p>
                {correctAnswer.translation && (
                  <p className="answer-translation">{correctAnswer.translation}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="result-actions">
        {success ? (
          <button className="next-btn" onClick={onNext}>
            继续下一句 ▶️
          </button>
        ) : (
          <button className="retry-btn" onClick={onRetry}>
            重试 🔄
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultFeedback;
