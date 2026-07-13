import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllScenes, getSceneById } from '@/data/scenes';
import { 
  useLocalStorage, 
  STORAGE_KEYS, 
  getDefaultStudyStats, 
  getDefaultUserProgress,
  getDefaultUserProfile,
  getDefaultTaskProgress,
  getDefaultAbilityProfile
} from '@/hooks/useLocalStorage';
import SceneCard from './components/SceneCard';
import TaskJourney from './components/TaskJourney';
import CoachTip from './components/CoachTip';
import FloatingPanel from './components/FloatingPanel';

const Home = () => {
  const navigate = useNavigate();
  const scenes = getAllScenes().filter(s => !s.comingSoon);
  const comingSoonScenes = getAllScenes().filter(s => s.comingSoon);
  const [selectedMode, setSelectedMode] = useState('typing');
  const [selectedScene, setSelectedScene] = useState('cafe-ordering');
  const [studyStats] = useLocalStorage(STORAGE_KEYS.STUDY_STATS, getDefaultStudyStats());
  const [userProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, getDefaultUserProgress());
  const [userProfile] = useLocalStorage(STORAGE_KEYS.USER_PROFILE, getDefaultUserProfile());
  const [taskProgress] = useLocalStorage(STORAGE_KEYS.TASK_PROGRESS, getDefaultTaskProgress());
  const [abilityProfile] = useLocalStorage(STORAGE_KEYS.ABILITY_PROFILE, getDefaultAbilityProfile());

  const currentScene = getSceneById(selectedScene);
  const currentTaskProgress = taskProgress[selectedScene] || {};

  const totalPractices = studyStats.typingModeCount + studyStats.voiceModeCount;
  const completedCount = currentScene?.tasks?.filter(t => 
    currentTaskProgress[t.id] === 'completed'
  ).length || 0;
  const totalTasks = currentScene?.tasks?.length || 0;

  const getPreparationScore = () => {
    const avgAbility = (abilityProfile.expression + abilityProfile.naturalness + 
      abilityProfile.fluency + abilityProfile.adaptability) / 4;
    const allScenes = getAllScenes().filter(s => !s.comingSoon);
    const totalAllTasks = allScenes.reduce((sum, s) => sum + (s.tasks?.length || 1), 0);
    let completedAllCount = 0;
    allScenes.forEach(scene => {
      if (userProgress.completedScenes.includes(scene.id)) {
        completedAllCount += scene.tasks?.length || 1;
      } else if (scene.tasks) {
        completedAllCount += scene.tasks.filter(t => {
          const status = taskProgress[scene.id]?.[t.id] || t.status;
          return status === 'completed';
        }).length;
      }
    });
    const taskScore = totalAllTasks > 0 ? (completedAllCount / totalAllTasks) * 50 : 0;
    return Math.round(avgAbility * 0.5 + taskScore);
  };

  const handleSceneClick = (sceneId) => {
    setSelectedScene(sceneId);
  };

  const handleStartPractice = () => {
    const scene = getSceneById(selectedScene);
    if (!scene) return;
    
    if (scene.tasks && scene.tasks.length > 0) {
      const firstAvailableTask = scene.tasks.find(t => {
        const status = currentTaskProgress[t.id] || t.status;
        return status !== 'locked';
      });
      if (firstAvailableTask) {
        navigate(`/practice/${selectedScene}/${firstAvailableTask.id}/${selectedMode}`);
      }
    } else {
      navigate(`/practice/${selectedScene}/default/${selectedMode}`);
    }
  };

  const handleTaskClick = (taskId, mode) => {
    const taskStatus = currentTaskProgress[taskId];
    if (taskStatus === 'locked') return;
    navigate(`/practice/interview/${taskId}/${mode}`);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const coachTips = [
    '先完成自我介绍，再进入项目追问',
    '尝试使用语音模式练习，提升口语能力',
    '多尝试不同分支选项，探索完整对话',
    '注意回答中的量化数据，让表达更有力',
    '练习后查看复盘报告，针对性提升'
  ];
  const currentTip = coachTips[Math.floor(Date.now() / 60000) % coachTips.length];

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="brand">
            <h1 className="brand-title">EngStage</h1>
            <p className="brand-subtitle">出海英语成长助手</p>
          </div>
          <button className="dashboard-btn" onClick={handleDashboard}>
            📊 数据面板
          </button>
        </div>
        <p className="header-slogan">在真实场景里完成关键英语任务</p>
      </header>

      <main className="home-main">
        <section className="progress-section">
          <div className="progress-card">
            <div className="progress-header">
              <span className="progress-label">整体英语能力</span>
              <span className="progress-score">{getPreparationScore()}%</span>
            </div>
            <p className="progress-desc">综合所有场景的学习进度和能力评分</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getPreparationScore()}%` }}></div>
            </div>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-value">{userProfile.daysStreak}</span>
                <span className="stat-label">连续学习天数</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userProfile.todayPracticeMinutes}</span>
                <span className="stat-label">今日练习时长</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{totalPractices}</span>
                <span className="stat-label">总练习次数</span>
              </div>
            </div>
          </div>
        </section>

        <section className="scenes-section">
          <h2 className="section-title">选择出海场景</h2>
          <div className="scenes-grid">
            {scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                mode={selectedMode}
                completed={userProgress.completedScenes.includes(scene.id)}
                taskProgress={taskProgress[scene.id]}
                onClick={() => handleSceneClick(scene.id, selectedMode)}
                isSelected={selectedScene === scene.id}
              />
            ))}
            {comingSoonScenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                mode={selectedMode}
                comingSoon={true}
                onClick={() => handleSceneClick(scene.id, selectedMode)}
              />
            ))}
          </div>
        </section>

        {currentScene?.tasks && currentScene.tasks.length > 0 && (
          <section className="journey-section">
            <div className="journey-header">
              <h2 className="section-title">任务旅程</h2>
              <span className="journey-progress">{completedCount} / {totalTasks} 任务</span>
            </div>
            <TaskJourney 
              tasks={currentScene.tasks} 
              taskProgress={currentTaskProgress}
              mode={selectedMode}
              onTaskClick={handleTaskClick}
            />
          </section>
        )}

        <CoachTip tip={currentTip} />

        <section className="features-section">
          <h2 className="section-title">为什么选择 EngStage？</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">场景任务链</h3>
              <p className="feature-description">完整的任务旅程，明确下一步练什么</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">预设追问</h3>
              <p className="feature-description">标准提问后的分支追问，模拟真实面试</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3 className="feature-title">语音练习</h3>
              <p className="feature-description">基于 Web Speech API，实时发音评分</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">能力画像</h3>
              <p className="feature-description">四项能力维度，追踪可见进步</p>
            </div>
          </div>
        </section>

        <FloatingPanel
          selectedMode={selectedMode}
          onModeChange={handleModeChange}
          onStartPractice={handleStartPractice}
          currentScene={currentScene}
        />
      </main>

      <footer className="home-footer">
        <p>EngStage — TRAE AI 创造力大赛参赛作品</p>
      </footer>
    </div>
  );
};

export default Home;
