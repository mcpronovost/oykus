import { useEffect, useState } from "react";
import { getHealth } from "./services/api/index.ts";

function OykApp() {
  const [status, setStatus] = useState("Checking the API.");

  useEffect(() => {
    getHealth()
      .then(() => {
        setStatus("The API is ready.");
      })
      .catch(() => {
        setStatus("The API is unavailable.");
      });
  }, []);

  return (
    <main className="oyk-app">
      <h1>Oykus</h1>
      <p>{status}</p>
    </main>
  );
}

export { OykApp };
