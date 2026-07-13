const TaskJourney = ({ tasks, taskProgress, mode, onTaskClick }) => {
  return (
    <div className="task-journey">
      <div className="journey-timeline">
        {tasks.map((task, index) => {
          const status = taskProgress[task.id] || task.status || 'locked';
          const isCompleted = status === 'completed';
          const isInProgress = status === 'in_progress';
          const isLocked = status === 'locked';
          
          return (
            <div key={task.id} className="task-item">
              <div className="task-number">
                {isCompleted ? '✓' : isLocked ? '🔒' : index + 1}
              </div>
              <div className={`task-card ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : isLocked ? 'locked' : ''}`}>
                <div className="task-header">
                  <h4 className="task-name">{task.name}</h4>
                  <span className={`task-status ${status}`}>
                    {isCompleted ? '已完成' : isInProgress ? '进行中' : '待解锁'}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                {!isLocked && (
                  <button 
                    className={`task-action ${isInProgress ? 'primary' : ''}`}
                    onClick={() => onTaskClick(task.id, mode)}
                  >
                    {isInProgress ? '继续练习 →' : '开始练习 →'}
                  </button>
                )}
                {isLocked && task.unlockCondition && (
                  <p className="task-lock-hint">
                    需要先完成「{tasks.find(t => t.id === task.unlockCondition.task)?.name}」
                  </p>
                )}
              </div>
              {index < tasks.length - 1 && (
                <div className={`journey-line ${isCompleted ? 'completed' : ''}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskJourney;
