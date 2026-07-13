const CoachTip = ({ tip }) => {
  return (
    <section className="coach-section">
      <div className="coach-card">
        <div className="coach-icon">🤖</div>
        <div className="coach-content">
          <span className="coach-label">AI 教练提示</span>
          <p className="coach-tip">{tip}</p>
        </div>
      </div>
    </section>
  );
};

export default CoachTip;
