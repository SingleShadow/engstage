import { useNavigate } from 'react-router-dom';
import { getAllScenes } from '@/data/scenes';
import { 
  useLocalStorage, 
  STORAGE_KEYS, 
  getDefaultStudyStats, 
  getDefaultUserProgress,
  getDefaultAbilityProfile,
  getDefaultTaskProgress,
  getDefaultReviewQueue
} from '@/hooks/useLocalStorage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [studyStats] = useLocalStorage(STORAGE_KEYS.STUDY_STATS, getDefaultStudyStats());
  const [userProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, getDefaultUserProgress());
  const [abilityProfile] = useLocalStorage(STORAGE_KEYS.ABILITY_PROFILE, getDefaultAbilityProfile());
  const [taskProgress] = useLocalStorage(STORAGE_KEYS.TASK_PROGRESS, getDefaultTaskProgress());
  const [reviewQueue] = useLocalStorage(STORAGE_KEYS.REVIEW_QUEUE, getDefaultReviewQueue());

  const scenes = getAllScenes().filter(s => !s.comingSoon);

  const handleBack = () => {
    navigate('/');
  };

  const handleGoReview = () => {
    navigate('/review');
  };

  const handleResetData = () => {
    if (confirm('确定要重置所有学习数据吗？此操作不可恢复。')) {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      window.location.reload();
    }
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

  const getSceneTaskProgress = (scene) => {
    if (!scene.tasks || scene.tasks.length === 0) return { completed: 0, total: 0 };
    const completed = scene.tasks.filter(t => taskProgress[scene.id]?.[t.id] === 'completed').length;
    return { completed, total: scene.tasks.length };
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <button className="back-btn" onClick={handleBack}>← 返回首页</button>
        <h1 className="dashboard-title">📊 学习数据</h1>
        <button className="reset-btn" onClick={handleResetData}>重置数据</button>
      </div>

      <div className="dashboard-content">
        <section className="summary-section">
          <h2 className="section-title">学习概览</h2>
          <div className="summary-cards">
            <div className="summary-card primary">
              <div className="card-icon">📚</div>
              <div className="card-info">
                <div className="card-value">{studyStats.typingModeCount + studyStats.voiceModeCount}</div>
                <div className="card-label">总练习次数</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">⏱️</div>
              <div className="card-info">
                <div className="card-value">{studyStats.totalPracticeMinutes}</div>
                <div className="card-label">总练习时长（分钟）</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">✅</div>
              <div className="card-info">
                <div className="card-value">{studyStats.passCount || 0}</div>
                <div className="card-label">通过次数</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">🎯</div>
              <div className="card-info">
                <div className="card-value">{studyStats.perfectMatches}</div>
                <div className="card-label">完美匹配次数</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">🔄</div>
              <div className="card-info">
                <div className="card-value">{studyStats.retryCount}</div>
                <div className="card-label">重试次数</div>
              </div>
            </div>
          </div>
        </section>

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

        <section className="scene-progress-section">
          <h2 className="section-title">场景进度</h2>
          <div className="scene-progress-list">
            {scenes.map(scene => {
              const taskProgressData = getSceneTaskProgress(scene);
              const isCompleted = userProgress.completedScenes.includes(scene.id);
              return (
                <div key={scene.id} className="scene-progress-item">
                  <div className="scene-info">
                    <span className="scene-icon">{scene.icon}</span>
                    <div className="scene-details">
                      <span className="scene-name">{scene.name}</span>
                      {taskProgressData.total > 0 && (
                        <span className="scene-task-progress">
                          {taskProgressData.completed} / {taskProgressData.total} 任务
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="scene-status">
                    {isCompleted ? (
                      <span className="completed-badge">✓ 已完成</span>
                    ) : (
                      <span className="pending-badge">进行中</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="review-section">
          <div className="section-header">
            <h2 className="section-title">待复练列表</h2>
            {reviewQueue.length > 0 && (
              <button className="view-review-btn" onClick={handleGoReview}>
                查看详情 →
              </button>
            )}
          </div>
          {reviewQueue.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p>暂无需要复练的项目</p>
            </div>
          ) : (
            <div className="review-mini-list">
              {reviewQueue.slice(0, 3).map(item => (
                <div key={item.id} className="review-mini-item">
                  <span className="review-mini-scene">
                    {scenes.find(s => s.id === item.sceneId)?.name || item.sceneId}
                  </span>
                  <span className="review-mini-count">{item.questions.length} 题</span>
                </div>
              ))}
              {reviewQueue.length > 3 && (
                <div className="review-mini-more">
                  还有 {reviewQueue.length - 3} 项待复练
                </div>
              )}
            </div>
          )}
        </section>

        <section className="tips-section">
          <h2 className="section-title">学习小贴士</h2>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">💡</span>
              <span className="tip-text">每天坚持练习10分钟，效果更好！</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <span className="tip-text">尝试使用语音模式练习，提升口语能力。</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔄</span>
              <span className="tip-text">多尝试不同分支选项，探索完整对话。</span>
            </div>
          </div>
        </section>
      </div>

      <div className="dashboard-footer">
        <button className="action-btn" onClick={handleBack}>
          继续练习 →
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
