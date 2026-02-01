import { OykProgress } from "@/components/ui";

export default function AppHeaderLeveling() {
  return (
    <section className="oyk-app-header-leveling">
      <span className="oyk-app-header-leveling-level">1</span>
      <OykProgress
        progress={61}
        goal={100}
        height={10}
        borderSize={2}
        borderColor="var(--oyk-app-header-bg-subtle)"
        trackColor="var(--oyk-app-header-bg-subtle)"
        thumbColor="linear-gradient(to right, var(--oyk-app-header-fg-subtle), var(--oyk-c-primary))"
      />
    </section>
  );
}
