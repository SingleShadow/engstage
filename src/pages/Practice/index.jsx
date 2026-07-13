import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSceneById, interviewTasks } from '@/data/scenes';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { 
  useLocalStorage, 
  STORAGE_KEYS, 
  getDefaultUserProgress, 
  getDefaultStudyStats,
  getDefaultTaskProgress,
  getDefaultAbilityProfile,
  getDefaultReviewQueue
} from '@/hooks/useLocalStorage';
import { matchAgainstOptions, calculateSimilarity } from '@/utils/fuzzyMatch';
import DialogueScene from './components/DialogueScene';
import TypingInput from './components/TypingInput';
import VoiceRecorder from './components/VoiceRecorder';
import ResultFeedback from './components/ResultFeedback';

const Practice = () => {
  const { sceneId, taskId, mode } = useParams();
  const navigate = useNavigate();
  const scene = getSceneById(sceneId);
  const taskData = taskId ? interviewTasks[taskId] : null;
  
  const validMode = mode === 'voice' ? 'voice' : 'typing';
  
  const [userProgress, setUserProgress] = useLocalStorage(STORAGE_KEYS.USER_PROGRESS, getDefaultUserProgress());
  const [studyStats, setStudyStats] = useLocalStorage(STORAGE_KEYS.STUDY_STATS, getDefaultStudyStats());
  const [taskProgress, setTaskProgress] = useLocalStorage(STORAGE_KEYS.TASK_PROGRESS, getDefaultTaskProgress());
  const [abilityProfile, setAbilityProfile] = useLocalStorage(STORAGE_KEYS.ABILITY_PROFILE, getDefaultAbilityProfile());
  const [reviewQueue, setReviewQueue] = useLocalStorage(STORAGE_KEYS.REVIEW_QUEUE, getDefaultReviewQueue());
  
  const { speak, isSpeaking } = useSpeechSynthesis();
  const { isListening, transcript, confidence, startListening, stopListening, resetTranscript, isSupported, isLoading } = useSpeechRecognition();
  
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isVoiceEvaluating, setIsVoiceEvaluating] = useState(false);
  const [isRecordingJustEnded, setIsRecordingJustEnded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [taskDialogues, setTaskDialogues] = useState([]);
  const [taskBranches, setTaskBranches] = useState({});
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  useEffect(() => {
    if (!scene) {
      navigate('/');
      return;
    }
    
    let dialogues;
    let branches;
    
    if (!taskId || taskId === 'default') {
      dialogues = scene.dialogue;
      branches = scene.branches || {};
    } else if (taskData) {
      dialogues = taskData.dialogue;
      branches = taskData.branches || {};
    }
    
    if (dialogues) {
      setTaskDialogues(dialogues);
      setTaskBranches(branches);
      loadDialogue(0, null, dialogues, branches);
    }
  }, [scene, taskId, taskData, navigate]);

  useEffect(() => {
    if (!isLoading && !isSupported && mode === 'voice') {
      navigate(`/practice/${sceneId}${taskId ? `/${taskId}` : ''}/typing`);
    }
  }, [isLoading, isSupported, mode, sceneId, taskId, navigate]);

  const loadDialogue = useCallback((index, branch = null, dialogues = taskDialogues, branches = taskBranches) => {
    let dialogueData;
    if (branch && branches[branch]) {
      dialogueData = branches[branch][0];
    } else {
      dialogueData = dialogues[index];
    }
    
    if (!dialogueData) {
      if (branch) {
        loadDialogue(index, null, dialogues, branches);
      }
      return;
    }
    
    setIsVoiceEvaluating(true);
    setIsRecordingJustEnded(false);
    setCurrentBranch(branch);
    setCurrentDialogue(dialogueData);
    setUserOptions(dialogueData.userOptions || []);
    setResult(null);
    setShowFeedback(false);
    resetTranscript();
    setDialogueIndex(index);
    
    setTimeout(() => {
      setIsVoiceEvaluating(false);
    }, 100);
    
    if (dialogueData.isEnd) {
      setIsFinished(true);
    }
  }, [taskDialogues, taskBranches, resetTranscript]);

  const handleSpeak = useCallback((text) => {
    speak(text);
  }, [speak]);

  const handleTypingSubmit = useCallback((input) => {
    if (!userOptions.length) return;
    
    const matchResult = matchAgainstOptions(input, userOptions);
    
    if (matchResult.matched) {
      setResult({ success: true, score: matchResult.score });
      setShowFeedback(true);
      setSelectedOption(matchResult.matchedOption || userOptions[0]);
      
      setStudyStats(prev => ({
        ...prev,
        typingModeCount: prev.typingModeCount + 1,
        passCount: prev.passCount + 1,
        perfectMatches: matchResult.score === 100 ? prev.perfectMatches + 1 : prev.perfectMatches,
        lastPracticeDate: new Date().toISOString().split('T')[0]
      }));
      
      updateAbilityProfile(matchResult.score);
    } else {
      setResult({ success: false, message: '答案不匹配，请重试' });
      setShowFeedback(true);
      
      setStudyStats(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1
      }));
    }
  }, [userOptions, setStudyStats]);

  const handleOptionSelect = useCallback((option) => {
    setResult({ success: true, score: 100 });
    setShowFeedback(true);
    setSelectedOption(option);
    
    setAnsweredQuestions(prev => [...prev, {
      question: currentDialogue?.text,
      answer: option.text,
      score: 100
    }]);
    
    setStudyStats(prev => ({
      ...prev,
      typingModeCount: prev.typingModeCount + 1,
      passCount: prev.passCount + 1,
      perfectMatches: prev.perfectMatches + 1,
      lastPracticeDate: new Date().toISOString().split('T')[0]
    }));
    
    updateAbilityProfile(100);
  }, [currentDialogue, setStudyStats]);

  const handleVoiceResult = useCallback(() => {
    if (!transcript || !userOptions.length || showFeedback) return;
    
    setIsVoiceEvaluating(true);
    
    setTimeout(() => {
      const matchResult = matchAgainstOptions(transcript, userOptions);
      let score;
      let matchedOption = userOptions[0];
      
      if (matchResult.matched) {
        score = Math.round(matchResult.score * 0.7 + confidence * 30);
        matchedOption = matchResult.matchedOption || userOptions[0];
      } else {
        const bestOption = userOptions[0];
        const similarity = calculateSimilarity(transcript, bestOption.text);
        score = Math.round(similarity * 0.7 + confidence * 30);
      }
      
      if (score >= 70) {
        setResult({ success: true, score, message: '发音不错！' });
        setSelectedOption(matchedOption);
        
        setAnsweredQuestions(prev => [...prev, {
          question: currentDialogue?.text,
          answer: transcript,
          score
        }]);
        
        updateAbilityProfile(score);
      } else {
        setResult({ success: false, score, message: '请再试一次' });
        setSelectedOption(null);
      }
      
      setShowFeedback(true);
      setIsVoiceEvaluating(false);
      
      setStudyStats(prev => ({
        ...prev,
        voiceModeCount: prev.voiceModeCount + 1,
        passCount: score >= 70 ? prev.passCount + 1 : prev.passCount,
        perfectMatches: score === 100 ? prev.perfectMatches + 1 : prev.perfectMatches,
        lastPracticeDate: new Date().toISOString().split('T')[0]
      }));
    }, 500);
  }, [transcript, userOptions, confidence, currentDialogue, setStudyStats]);

  const updateAbilityProfile = useCallback((score) => {
    setAbilityProfile(prev => {
      const weight = 0.3;
      return {
        expression: Math.round(prev.expression * (1 - weight) + score * weight),
        naturalness: Math.round(prev.naturalness * (1 - weight) + score * weight),
        fluency: Math.round(prev.fluency * (1 - weight) + score * weight),
        adaptability: Math.round(prev.adaptability * (1 - weight) + score * weight)
      };
    });
  }, [setAbilityProfile]);

  useEffect(() => {
    if (isListening) {
      setIsRecordingJustEnded(true);
    } else if (isRecordingJustEnded && !isVoiceEvaluating && !showFeedback) {
      setIsRecordingJustEnded(false);
      if (transcript) {
        handleVoiceResult();
      } else {
        setResult({ success: false, score: 0, message: '请尝试说点什么' });
        setShowFeedback(true);
      }
    }
  }, [isListening, transcript, isVoiceEvaluating, showFeedback, isRecordingJustEnded, handleVoiceResult]);

  const handleNext = useCallback(() => {
    if (!currentDialogue || !currentDialogue.userOptions || !selectedOption) return;
    
    const nextStep = selectedOption.next;
    const followup = selectedOption.followup;
    
    if (followup && taskBranches[followup]) {
      loadDialogue(0, followup);
    } else if (typeof nextStep === 'number') {
      const nextDialogueIndex = taskDialogues.findIndex(d => d.id === nextStep);
      if (nextDialogueIndex !== -1) {
        loadDialogue(nextDialogueIndex, null);
      }
    } else if (typeof nextStep === 'string') {
      if (taskBranches[nextStep]) {
        loadDialogue(0, nextStep);
      } else {
        const nextDialogueIndex = taskDialogues.findIndex(d => d.id === nextStep);
        if (nextDialogueIndex !== -1) {
          loadDialogue(nextDialogueIndex, null);
        }
      }
    }
    setSelectedOption(null);
  }, [currentDialogue, taskBranches, taskDialogues, loadDialogue, selectedOption]);

  const handleRetry = useCallback(() => {
    setResult(null);
    setShowFeedback(false);
    resetTranscript();
    setIsRecordingJustEnded(false);
  }, [resetTranscript]);

  const handleBack = () => {
    navigate('/');
  };

  const handleFinish = () => {
    if (!scene) return;
    
    setStudyStats(prev => ({
      ...prev,
      totalPracticeMinutes: prev.totalPracticeMinutes + 1
    }));
    
    setUserProgress(prev => ({
      ...prev,
      completedScenes: prev.completedScenes.includes(sceneId) 
        ? prev.completedScenes 
        : [...prev.completedScenes, sceneId]
    }));
    
    if (taskId) {
      setTaskProgress(prev => ({
        ...prev,
        [sceneId]: {
          ...prev[sceneId],
          [taskId]: 'completed'
        }
      }));
      
      const lowScoreAnswers = answeredQuestions.filter(a => a.score < 80);
      if (lowScoreAnswers.length > 0) {
        setReviewQueue(prev => [...prev, {
          id: Date.now(),
          sceneId,
          taskId,
          questions: lowScoreAnswers,
          createdAt: new Date().toISOString()
        }]);
      }
    }
    
    navigate('/review');
  };

  if (!scene) {
    return <div className="practice-page">场景不存在</div>;
  }

  const totalDialogues = taskDialogues.length;
  const currentTask = scene.tasks?.find(t => t.id === taskId);

  return (
    <div className="practice-page">
      <div className="practice-header">
        <button className="back-btn" onClick={handleBack}>← 返回</button>
        <div className="mode-badge">{validMode === 'typing' ? '⌨️ 打字模式' : '🎤 语音模式'}</div>
        <div className="progress-info">
          <span className="progress-text">进度</span>
          <span className="progress-value">{currentDialogue?.isEnd ? totalDialogues : dialogueIndex + 1}/{totalDialogues}</span>
        </div>
      </div>

      {currentTask && (
        <div className="task-header">
          <div className="task-badge">📋 {currentTask.name}</div>
          <p className="task-description">{currentTask.description}</p>
        </div>
      )}

      <div className="practice-content">
        {isFinished ? (
          <div className="finish-screen">
            <div className="finish-icon">🎉</div>
            <h2 className="finish-title">恭喜完成！</h2>
            <p className="finish-message">您已完成「{currentTask?.name || scene.name}」的练习</p>
            {answeredQuestions.length > 0 && (
              <div className="finish-summary">
                <h3>练习概览</h3>
                <div className="answer-list">
                  {answeredQuestions.map((item, index) => (
                    <div key={index} className="answer-item">
                      <span className="answer-score" style={{ color: item.score >= 80 ? '#10b981' : '#f59e0b' }}>
                        {item.score}分
                      </span>
                      <div className="answer-content">
                        <span className="answer-label">问：</span>{item.question}
                      </div>
                      <div className="answer-content">
                        <span className="answer-label">答：</span>{item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="finish-btn" onClick={handleFinish}>查看复盘 →</button>
          </div>
        ) : (
          <>
            <DialogueScene
              scene={scene}
              currentDialogue={currentDialogue}
              isSpeaking={isSpeaking}
              onSpeak={handleSpeak}
            />

            {showFeedback ? (
              <ResultFeedback
                result={result}
                onNext={handleNext}
                onRetry={handleRetry}
                correctAnswer={userOptions[0]}
              />
            ) : (
              <>
                {validMode === 'typing' ? (
                  <TypingInput
                    options={userOptions}
                    onSubmit={handleTypingSubmit}
                    onSelectOption={handleOptionSelect}
                    showHint={false}
                  />
                ) : (
                  <VoiceRecorder
                    isListening={isListening}
                    transcript={transcript}
                    confidence={confidence}
                    onStart={startListening}
                    onStop={stopListening}
                    isSupported={isSupported}
                    targetText={userOptions[0]?.text}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Practice;
