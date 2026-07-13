const StudyOverview = ({ stats }) => {
  const totalPractices = stats.typingModeCount + stats.voiceModeCount;
  
  return (
    <div className="study-overview">
      <h3 className="overview-title">学习概览</h3>
      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-value">{totalPractices}</div>
          <div className="card-label">练习次数</div>
        </div>
        <div className="overview-card">
          <div className="card-value">{stats.totalPracticeMinutes}</div>
          <div className="card-label">练习时长（分钟）</div>
        </div>
        <div className="overview-card">
          <div className="card-value">{stats.passCount || 0}</div>
          <div className="card-label">通过次数</div>
        </div>
        <div className="overview-card">
          <div className="card-value">{stats.perfectMatches}</div>
          <div className="card-label">完美匹配</div>
        </div>
        <div className="overview-card">
          <div className="card-value">{stats.retryCount}</div>
          <div className="card-label">重试次数</div>
        </div>
        <div className="overview-card">
          <div className="card-value">{stats.lastPracticeDate || '还未练习'}</div>
          <div className="card-label">上次练习</div>
        </div>
      </div>
    </div>
  );
};

export default StudyOverview;
