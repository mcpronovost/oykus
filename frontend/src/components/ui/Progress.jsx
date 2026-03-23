export default function OykProgress({
  progress = 0,
  goal = 0,
  height = 12,
  borderSize = 3,
  borderColor = "var(--oyk-card-subtle-bg)",
  trackColor = "var(--oyk-card-subtle-bg)",
  thumbColor = "var(--oyk-card-subtle-fg)",
}) {
  return (
    <div className="oyk-progress">
      <div
        className="oyk-progress-track"
        style={{
          backgroundColor: trackColor,
          borderColor: borderColor,
          borderWidth: `${borderSize}px`,
          borderRadius: `${height / 2}px`,
          height: `${height}px`,
        }}
      >
        <div className="oyk-progress-thumb" style={{ background: thumbColor, width: `${(progress * 100) / goal}%` }}>
          {progress}/{goal}
        </div>
      </div>
    </div>
  );
}
