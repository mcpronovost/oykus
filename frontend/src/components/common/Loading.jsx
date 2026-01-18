export default function OykLoading({ variant = "circles", fullview = false }) {
  return (
    <div className={`oyk-loading ${fullview ? "oyk-loading-fullview" : ""}`}>
      <div className={`oyk-loading-spinner oyk-${variant}`}></div>
    </div>
  );
}