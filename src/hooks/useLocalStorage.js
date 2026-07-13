import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export const STORAGE_KEYS = {
  USER_PROGRESS: 'engstage_user_progress',
  STUDY_STATS: 'engstage_study_stats',
  SETTINGS: 'engstage_settings',
  USER_PROFILE: 'engstage_user_profile',
  TASK_PROGRESS: 'engstage_task_progress',
  ABILITY_PROFILE: 'engstage_ability_profile',
  REVIEW_QUEUE: 'engstage_review_queue'
};

export const getDefaultUserProgress = () => ({
  completedScenes: [],
  inProgressScenes: {}
});

export const getDefaultStudyStats = () => ({
  totalPracticeMinutes: 0,
  typingModeCount: 0,
  voiceModeCount: 0,
  perfectMatches: 0,
  passCount: 0,
  retryCount: 0,
  lastPracticeDate: null
});

export const getDefaultSettings = () => ({
  speechRate: 1.0,
  showTranslation: true,
  autoPlay: true
});

export const getDefaultUserProfile = () => ({
  goal: 'overseas_job',
  targetDate: null,
  daysStreak: 0,
  todayPracticeMinutes: 0,
  lastPracticeDate: null
});

export const getDefaultTaskProgress = () => ({
  interview: {
    diagnosis: 'in_progress',
    intro: 'locked',
    project_followup: 'locked',
    stress_response: 'locked',
    review: 'locked'
  }
});

export const getDefaultAbilityProfile = () => ({
  expression: 0,
  naturalness: 0,
  fluency: 0,
  adaptability: 0
});

export const getDefaultReviewQueue = () => [];
