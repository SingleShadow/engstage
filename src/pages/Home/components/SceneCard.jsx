const SceneCard = ({ scene, mode, completed, onClick, comingSoon, isSelected, taskProgress }) => {
  const difficultyStars = Array(scene.difficulty).fill('⭐');
  
  const completedTasks = taskProgress 
    ? Object.values(taskProgress).filter(v => v === 'completed').length 
    : 0;
  const totalTasks = scene.tasks?.length || 0;
  
  return (
    <div 
      className={`scene-card ${completed ? 'completed' : ''} ${isSelected ? 'selected' : ''} ${comingSoon ? 'coming-soon' : ''}`} 
      onClick={() => !comingSoon && onClick(scene.id)}
    >
      <div className="card-icon">{scene.icon}</div>
      <div className="card-content">
        <h3 className="card-title">{scene.name}</h3>
        <div className="card-difficulty">{difficultyStars.join('')}</div>
        <div className="card-category">
          <span className="category-badge">
            {scene.category === 'daily-life' ? '生活日常' : 
             scene.category === 'travel' ? '出行交通' : '职场商务'}
          </span>
          {completed && <span className="completed-badge">✓ 已完成</span>}
          {comingSoon && <span className="coming-soon-badge">即将上线</span>}
        </div>
        {totalTasks > 0 && !comingSoon && (
          <div className="card-task-progress">
            {completedTasks} / {totalTasks} 任务
          </div>
        )}
      </div>
      {isSelected && (
        <div className="card-action">
          <span className="action-text">已选中</span>
          <span className="action-icon">✓</span>
        </div>
      )}
    </div>
  );
};

export default SceneCard;
