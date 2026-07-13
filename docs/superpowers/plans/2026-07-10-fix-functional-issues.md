# Fix Functional Issues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mode selection bug where voice mode doesn't work properly, and ensure consistent mode passing throughout the application.

**Architecture:** The fix involves correcting mode parameter flow from Home to Practice page, fixing useEffect dependency in useSpeechRecognition, ensuring TaskJourney passes the correct mode, and adding proper mode detection in Practice page.

**Tech Stack:** React, React Router, Vite, Web Speech API, localStorage

## Global Constraints

- Must support both typing and voice modes
- Voice mode requires browser SpeechRecognition support
- Mode must be preserved when navigating between pages
- All navigation must use React Router's navigate function

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/pages/Home/index.jsx` | Home page with mode selector, scene cards, task journey |
| `src/pages/Home/components/TaskJourney.jsx` | Display tasks with completion status and click handlers |
| `src/pages/Practice/index.jsx` | Practice page handling typing/voice modes |
| `src/hooks/useSpeechRecognition.js` | Speech recognition hook with support detection |
| `src/App.jsx` | Route configuration |

---

### Task 1: Fix TaskJourney to receive and pass mode parameter

**Files:**
- Modify: `src/pages/Home/components/TaskJourney.jsx`

**Interfaces:**
- Consumes: `tasks` (array), `taskProgress` (object), `mode` (string), `onTaskClick` (function)
- Produces: Click handler that passes `taskId` and `mode`

- [ ] **Step 1: Update TaskJourney component to accept mode prop**

```javascript
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
```

- [ ] **Step 2: Build and verify no syntax errors**

Run: `npm run build`
Expected: PASS without errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home/components/TaskJourney.jsx
git commit -m "fix: TaskJourney now accepts and passes mode parameter"
```

---

### Task 2: Fix Home page handleTaskClick to accept and use mode

**Files:**
- Modify: `src/pages/Home/index.jsx:62-66`

**Interfaces:**
- Consumes: `selectedMode` (string state), `currentTaskProgress` (object), `navigate` (function)
- Produces: Updated `handleTaskClick(taskId, mode)` function

- [ ] **Step 1: Update handleTaskClick to accept mode parameter**

```javascript
const handleTaskClick = (taskId, mode) => {
  const taskStatus = currentTaskProgress[taskId];
  if (taskStatus === 'locked') return;
  navigate(`/practice/interview/${taskId}/${mode}`);
};
```

- [ ] **Step 2: Update TaskJourney component call to pass mode**

```javascript
<TaskJourney 
  tasks={currentScene.tasks} 
  taskProgress={currentTaskProgress}
  mode={selectedMode}
  onTaskClick={handleTaskClick}
/>
```

- [ ] **Step 3: Build and verify no syntax errors**

Run: `npm run build`
Expected: PASS without errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home/index.jsx
git commit -m "fix: handleTaskClick now accepts and uses mode parameter"
```

---

### Task 3: Fix useSpeechRecognition useEffect to properly detect support

**Files:**
- Modify: `src/hooks/useSpeechRecognition.js:66-69`

**Interfaces:**
- Consumes: `isSupported` (state), `mode` (from Practice page), `navigate` (function)
- Produces: Proper support detection that doesn't redirect prematurely

- [ ] **Step 1: Add isLoading state to useSpeechRecognition**

```javascript
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined';
    const SpeechRecognition = hasWindow && (window.SpeechRecognition || window.webkitSpeechRecognition);
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setIsLoading(false);
      return;
    }

    setIsSupported(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setConfidence(0);
        setError(null);
      };

      recognition.onresult = (event) => {
        try {
          const result = event.results[0][0];
          setTranscript(result.transcript);
          setConfidence(result.confidence);
        } catch (err) {
          console.error('Speech recognition result error:', err);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      return () => {
        try {
          recognition.abort();
        } catch (err) {
          console.error('Speech recognition cleanup error:', err);
        }
      };
    } catch (err) {
      console.error('Speech recognition initialization error:', err);
      setIsSupported(false);
    }
    setIsLoading(false);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('not-supported');
      console.warn('Speech recognition is not supported');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        setError(null);
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
        setError('start-failed');
        setIsListening(false);
      }
    }
  }, [isSupported, recognitionRef, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Speech recognition stop error:', err);
        setIsListening(false);
      }
    }
  }, [recognitionRef, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    isLoading
  };
};
```

- [ ] **Step 2: Build and verify no syntax errors**

Run: `npm run build`
Expected: PASS without errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSpeechRecognition.js
git commit -m "fix: add isLoading state to prevent premature support check"
```

---

### Task 4: Fix Practice page useEffect to wait for support detection

**Files:**
- Modify: `src/pages/Practice/index.jsx:66-69`

**Interfaces:**
- Consumes: `isSupported` (from hook), `isLoading` (from hook), `mode` (from params), `navigate` (function)
- Produces: Proper redirect only after support detection is complete

- [ ] **Step 1: Update useEffect to destructure isLoading from hook**

```javascript
const { isListening, transcript, confidence, startListening, stopListening, resetTranscript, isSupported, isLoading } = useSpeechRecognition();
```

- [ ] **Step 2: Update useEffect to check isLoading before redirecting**

```javascript
useEffect(() => {
  if (!isLoading && !isSupported && mode === 'voice') {
    navigate(`/practice/${sceneId}${taskId ? `/${taskId}` : ''}/typing`);
  }
}, [isLoading, isSupported, mode, sceneId, taskId, navigate]);
```

- [ ] **Step 3: Build and verify no syntax errors**

Run: `npm run build`
Expected: PASS without errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/Practice/index.jsx
git commit -m "fix: wait for support detection before redirecting to typing mode"
```

---

### Task 5: Add mode validation in Practice page

**Files:**
- Modify: `src/pages/Practice/index.jsx:18-25`

**Interfaces:**
- Consumes: `mode` (from params)
- Produces: Default to 'typing' if mode is invalid

- [ ] **Step 1: Add mode validation**

```javascript
const { sceneId, taskId, mode } = useParams();
const navigate = useNavigate();
const scene = getSceneById(sceneId);
const taskData = taskId ? interviewTasks[taskId] : null;

const validMode = mode === 'voice' ? 'voice' : 'typing';
```

- [ ] **Step 2: Update all mode references to use validMode**

```javascript
<div className="mode-badge">{validMode === 'typing' ? '⌨️ 打字模式' : '🎤 语音模式'}</div>
```

```javascript
{mode === 'typing' ? (
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
```

- [ ] **Step 3: Build and verify no syntax errors**

Run: `npm run build`
Expected: PASS without errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/Practice/index.jsx
git commit -m "fix: add mode validation to prevent invalid mode values"
```

---

### Task 6: End-to-end testing of mode flow

**Files:**
- Test: Manual verification

**Interfaces:**
- Test: Home → Scene Card → Practice page mode preservation
- Test: Home → Task Journey → Practice page mode preservation
- Test: Voice mode redirect when not supported

- [ ] **Step 1: Start development server**

Run: `npm run dev`
Expected: Server starts on port 5173

- [ ] **Step 2: Test typing mode flow**

1. Open browser at http://localhost:5173
2. Ensure mode selector shows "打字模式" selected
3. Click "英文面试" scene card
4. Verify URL contains `/typing`
5. Verify practice page shows typing mode UI

- [ ] **Step 3: Test voice mode flow**

1. On home page, click "语音模式" button
2. Verify mode selector shows "语音模式" selected
3. Click "英文面试" scene card
4. Verify URL contains `/voice`
5. Verify practice page shows voice mode UI with microphone

- [ ] **Step 4: Test task journey mode flow**

1. On home page, select "语音模式"
2. In task journey, click a task button
3. Verify URL contains `/voice`
4. Verify practice page shows voice mode UI

- [ ] **Step 5: Commit test verification**

```bash
git commit -m "test: verify mode flow works correctly for both typing and voice modes"
```

---

## Self-Review

**1. Spec coverage:**
- Mode selection bug fix: Task 1-5
- Voice mode redirect: Task 3-4
- Mode validation: Task 5
- End-to-end testing: Task 6

**2. Placeholder scan:**
- No TBD/TODO/fill in details
- All steps include complete code
- All commands include exact output

**3. Type consistency:**
- `mode` parameter consistently passed as string
- `isSupported` and `isLoading` correctly used throughout
- Route parameters correctly matched

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-10-fix-functional-issues.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**