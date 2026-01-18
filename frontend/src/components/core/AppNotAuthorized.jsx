import "@/assets/styles/core/_app-notauthorized.scss";
import { useRouter } from "@/services/router";

export default function AppNotAuthorized() {
  const { n } = useRouter();

  return (
    <section className="oyk-app-not-authorized">
      <div className="oyk-app-not-authorized-content">
        <h1>401</h1>
        <p>You are not authorized to access this page.</p>
      </div>
      <div className="oyk-app-not-authorized-actions">
        <button className="oyk-app-not-authorized-actions-button" onClick={() => n("home")}>
          Go to home
        </button>
      </div>
    </section>
  );
}