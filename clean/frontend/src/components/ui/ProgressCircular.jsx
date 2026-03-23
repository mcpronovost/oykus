export default function OykProgressCircular({
  size = 120,
  borderSize = 12,
  progress = 0,
  bgColor = "var(--oyk-card-subtle-bg)",
  fgColor = "var(--oyk-c-primary)",
  marginAuto = false,
  children,
}) {
  const radius = (size - borderSize) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        position: "relative",
        margin: marginAuto ? "0 auto" : 0,
      }}
    >
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={bgColor} strokeWidth={borderSize} fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fgColor}
          strokeWidth={borderSize}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.4s ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.2,
          color: fgColor,
        }}
      >
        {children}
      </div>
    </div>
  );
}
