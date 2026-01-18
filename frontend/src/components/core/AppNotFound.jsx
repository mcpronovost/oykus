// import { useRouter } from "@/services/router";

export default function AppNotfound() {
  // const { n } = useRouter();

  return (
    <section className="oyk-app-not-found">
      <div className="oyk-app-not-found-content">
        <h1>404</h1>
        <p>Page not found.</p>
      </div>
      <div className="oyk-app-not-found-actions">
        <button className="oyk-app-not-found-actions-button" onClick={() => /* n("home") */ {}}>
          Go to home
        </button>
      </div>
    </section>
  );
}