interface OykProgressBarProps {
  progress: number;
}

export default function OykProgressBar({ progress }: OykProgressBarProps) {
  return (
    <div className="oyk-progress-bar">
      <div className="oyk-progress-bar-fill" style={{ width: `${progress}%` }}></div>
    </div>
  );
}