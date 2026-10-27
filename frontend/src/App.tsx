import { lazy, Suspense } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";

const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

export default function OykApp() {
  const { route } = useRouter();
  const { isAuth } = useAuth();

  if (!route) {
    return null;
  }

  let Page = route.component;

  if (route.name === "home") {
    Page = isAuth ? Dashboard : Home;
  }

  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
}
