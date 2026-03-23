export default function OykDisplay({ img, name, type, blurred = false }) {
  return (
    <div className={`oyk-display ${blurred ? "blurred" : ""}`}>
      <div className="oyk-display-overlay" style={{ backgroundImage: `url(${img})` }}></div>
      <div className="oyk-display-content">
        <div
          className="oyk-display-content-image"
          style={{ backgroundImage: `url(${img})` }}
        ></div>
        <div className="oyk-display-content-info">
          <h3>{name}</h3>
          <p>{type}</p>
        </div>
      </div>
    </div>
  );
}
