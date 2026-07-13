import { useEffect } from 'react';

const DialogueScene = ({ scene, currentDialogue, isSpeaking, onSpeak }) => {
  useEffect(() => {
    if (currentDialogue && onSpeak && !isSpeaking) {
      const timer = setTimeout(() => {
        onSpeak(currentDialogue.text);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentDialogue, onSpeak, isSpeaking]);

  if (!scene || !currentDialogue) {
    return null;
  }

  const isLeftSpeaker = currentDialogue.speaker === 'left';
  const character = isLeftSpeaker ? scene.characters.left : scene.characters.right;

  return (
    <div className="dialogue-scene">
      <div className="scene-header">
        <span className="scene-icon">{scene.icon}</span>
        <span className="scene-name">{scene.name}</span>
      </div>

      <div className="characters-area">
        <div className={`character ${isLeftSpeaker ? 'active' : ''}`}>
          <div className="avatar">{scene.characters.left.avatar}</div>
          <div className="character-name">{scene.characters.left.name}</div>
        </div>

        <div className="vs-badge">VS</div>

        <div className={`character ${!isLeftSpeaker ? 'active' : ''}`}>
          <div className="avatar">{scene.characters.right.avatar}</div>
          <div className="character-name">{scene.characters.right.name}</div>
        </div>
      </div>

      <div className="dialogue-bubble-container">
        <div className={`dialogue-bubble ${isLeftSpeaker ? 'left' : 'right'}`}>
          <div className="speaker-name">{character.name}</div>
          <div className="dialogue-text">{currentDialogue.text}</div>
          {currentDialogue.translation && (
            <div className="dialogue-translation">{currentDialogue.translation}</div>
          )}
          {isSpeaking && (
            <div className="speaking-indicator">
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogueScene;
