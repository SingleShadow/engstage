import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSceneById } from '@/data/scenes';
import { 
  useLocalStorage, 
  STORAGE_KEYS, 
  getDefaultReviewQueue,
  getDefaultAbilityProfile,
  getDefaultTaskProgress
} from '@/hooks/useLocalStorage';
import { calculateSimilarity } from '@/utils/fuzzyMatch';

const Review = () => {
  const navigate = useNavigate();
  const [reviewQueue, setReviewQueue] = useLocalStorage(STORAGE_KEYS.REVIEW_QUEUE, getDefaultReviewQueue());
  const [abilityProfile] = useLocalStorage(STORAGE_KEYS.ABILITY_PROFILE, getDefaultAbilityProfile());
  const [taskProgress] = useLocalStorage(STORAGE_KEYS.TASK_PROGRESS, getDefaultTaskProgress());
  const [selectedReview, setSelectedReview] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceResult, setPracticeResult] = useState(null);

  const reviewItems = reviewQueue.slice(0, 5);
  const needReviewCount = reviewQueue.length;

  const getSceneName = (sceneId) => {
    const scene = getSceneById(sceneId);
    return scene?.name || sceneId;
  };

  const getTaskName = (sceneId, taskId) => {
    const scene = getSceneById(sceneId);
    return scene?.tasks?.find(t => t.id === taskId)?.name || taskId;
  };

  const handleSelectReview = (item) => {
    setSelectedReview(item);
    setPracticeAnswer('');
    setPracticeResult(null);
  };

  const handlePracticeSubmit = () => {
    if (!practiceAnswer.trim() || !selectedReview) return;
    
    const firstQuestion = selectedReview.questions[0];
    const score = calculateSimilarity(practiceAnswer, firstQuestion.answer);
    
    setPracticeResult({
      score,
      success: score >= 70,
      originalAnswer: firstQuestion.answer,
      userAnswer: practiceAnswer
    });
  };

  const handleRemoveFromQueue = (id) => {
    setReviewQueue(prev => prev.filter(item => item.id !== id));
    if (selectedReview?.id === id) {
      setSelectedReview(null);
      setPracticeResult(null);
      setPracticeAnswer('');
    }
  };

  const handleRetryTask = (sceneId, taskId) => {
    navigate(`/practice/${sceneId}/${taskId}/typing`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const getAbilityLevel = (score) => {
    if (score >= 90) return { level: '优秀', color: '#10b981' };
    if (score >= 80) return { level: '良好', color: '#3b82f6' };
    if (score >= 60) return { level: '及格', color: '#f59e0b' };
    return { level: '需加强', color: '#ef4444' };
  };

  const abilityItems = [
    { key: 'expression', label: '表达完整度', score: abilityProfile.expression },
    { key: 'naturalness', label: '语言自然度', score: abilityProfile.naturalness },
    { key: 'fluency', label: '发音流畅度', score: abilityProfile.fluency },
    { key: 'adaptability', label: '应对灵活度', score: abilityProfile.adaptability }
  ];

  const avgAbility = Math.round((abilityProfile.expression + abilityProfile.naturalness + 
    abilityProfile.fluency + abilityProfile.adaptability) / 4);

  return (
    <div className="review-page">
      <header className="review-header">
        <button className="back-btn" onClick={handleGoHome}>← 返回首页</button>
        <h1 className="review-title">📝 练习复盘</h1>
        <div className="review-badge">{needReviewCount} 项待复练</div>
      </header>

      <main className="review-main">
        <section className="ability-section">
          <h2 className="section-title">能力画像</h2>
          <div className="ability-card">
            <div className="ability-overview">
              <span className="ability-score" style={{ color: getAbilityLevel(avgAbility).color }}>
                {avgAbility}分
              </span>
              <span className="ability-level">综合评级：{getAbilityLevel(avgAbility).level}</span>
            </div>
            <div className="ability-grid">
              {abilityItems.map(item => (
                <div key={item.key} className="ability-item">
                  <span className="ability-label">{item.label}</span>
                  <div className="ability-bar">
                    <div 
                      className="ability-fill" 
                      style={{ 
                        width: `${item.score}%`,
                        background: getAbilityLevel(item.score).color
                      }}
                    ></div>
                  </div>
                  <span className="ability-value" style={{ color: getAbilityLevel(item.score).color }}>
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="review-list-section">
          <div className="section-header">
            <h2 className="section-title">待复练列表</h2>
            <span className="review-count">{needReviewCount} 题需复练</span>
          </div>
          {needReviewCount === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p>太棒了！暂无需要复练的项目</p>
              <button className="empty-btn" onClick={handleGoHome}>继续练习 →</button>
            </div>
          ) : (
            <div className="review-list">
              {reviewItems.map(item => (
                <div 
                  key={item.id} 
                  className={`review-item ${selectedReview?.id === item.id ? 'selected' : ''}`}
                  onClick={() => handleSelectReview(item)}
                >
                  <div className="review-item-header">
                    <div className="review-item-info">
                      <span className="review-scene">{getSceneName(item.sceneId)}</span>
                      <span className="review-task">{getTaskName(item.sceneId, item.taskId)}</span>
                    </div>
                  </div>
                  <div className="review-item-content">
                    <p className="review-preview">
                      {item.questions[0]?.question?.substring(0, 50)}...
                    </p>
                  </div>
                  <button 
                    className="remove-btn" 
                    onClick={(e) => { e.stopPropagation(); handleRemoveFromQueue(item.id); }}
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedReview && (
          <section className="practice-section">
            <h2 className="section-title">补弱练习</h2>
            <div className="practice-card">
              <div className="practice-question">
                <span className="question-label">原题：</span>
                <p>{selectedReview.questions[0]?.question}</p>
              </div>
              <div className="practice-original">
                <span className="original-label">参考回答：</span>
                <p>{selectedReview.questions[0]?.answer}</p>
              </div>
              <div className="practice-input">
                <textarea
                  className="practice-textarea"
                  placeholder="请重新输入您的回答..."
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  rows={4}
                />
                <button 
                  className="practice-submit-btn" 
                  onClick={handlePracticeSubmit}
                  disabled={!practiceAnswer.trim()}
                >
                  提交练习
                </button>
              </div>
              {practiceResult && (
                <div className={`practice-result ${practiceResult.success ? 'success' : 'fail'}`}>
                  <div className="result-header">
                    <span className="result-icon">{practiceResult.success ? '✅' : '💪'}</span>
                    <span className="result-score">得分：{practiceResult.score}分</span>
                  </div>
                  <div className="result-comparison">
                    <div className="comparison-item">
                      <span className="comparison-label">您的回答：</span>
                      <p>{practiceResult.userAnswer}</p>
                    </div>
                    <div className="comparison-item">
                      <span className="comparison-label">参考回答：</span>
                      <p>{practiceResult.originalAnswer}</p>
                    </div>
                  </div>
                  <div className="result-actions">
                    <button 
                      className="result-btn retry" 
                      onClick={() => { setPracticeAnswer(''); setPracticeResult(null); }}
                    >
                      再练一次
                    </button>
                    <button 
                      className="result-btn complete" 
                      onClick={() => handleRemoveFromQueue(selectedReview.id)}
                    >
                      标记完成
                    </button>
                    <button 
                      className="result-btn practice" 
                      onClick={() => handleRetryTask(selectedReview.sceneId, selectedReview.taskId)}
                    >
                      重新练习任务
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Review;
