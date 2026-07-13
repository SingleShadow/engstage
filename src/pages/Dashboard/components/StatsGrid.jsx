const StatsGrid = ({ stats }) => {
  const totalPractices = stats.typingModeCount + stats.voiceModeCount;
  const accuracy = totalPractices > 0 
    ? Math.round((stats.perfectMatches / totalPractices) * 100) 
    : 0;

  const statItems = [
    { icon: '📚', label: '练习次数', value: totalPractices, color: '#4F46E5' },
    { icon: '⏱️', label: '练习时长', value: `${stats.totalPracticeMinutes} 分钟`, color: '#7C3AED' },
    { icon: '✅', label: '完美匹配', value: stats.perfectMatches, color: '#10B981' },
    { icon: '📊', label: '正确率', value: `${accuracy}%`, color: '#F59E0B' },
    { icon: '⌨️', label: '打字练习', value: stats.typingModeCount, color: '#06B6D4' },
    { icon: '🎤', label: '语音练习', value: stats.voiceModeCount, color: '#EC4899' },
    { icon: '🔄', label: '重试次数', value: stats.retryCount, color: '#EF4444' },
    { icon: '📅', label: '上次练习', value: stats.lastPracticeDate || '还未练习', color: '#8B5CF6' }
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="stat-card"
          style={{ '--stat-color': item.color }}
        >
          <div className="stat-icon">{item.icon}</div>
          <div className="stat-value">{item.value}</div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
