import OykAlert from "./Alert";

export default function OykFormHelp({ helptext, style }) {
  return (
    <div className="oyk-form-help" style={style}>
      {helptext && <OykAlert message={helptext} variant="default" showIcon={false} small ghost />}
    </div>
  );
}