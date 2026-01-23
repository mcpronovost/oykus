export default function OykProgress({ progress = 0, goal = 0, height = 12 }) {
  return (
    <div className="oyk-progress">
      <div className="oyk-progress-track" style={{
        borderRadius: `${height/2}px`,
        height: `${height}px`
      }}>
        <div className="oyk-progress-thumb" style={{ width: `${(progress * 100) / goal}%` }}>
          {progress}/{goal}
        </div>
      </div>
    </div>
  );
}
