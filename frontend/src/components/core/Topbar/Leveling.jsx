import { OykProgress } from "@/components/ui";

export default function CoreTopbarLeveling() {
  return (
    <section className="oyk-core-topbar-leveling">
      <span className="oyk-core-topbar-leveling-level">1</span>
      <OykProgress
        progress={61}
        goal={100}
        height={10}
        borderSize={2}
        borderColor="var(--oyk-core-topbar-subtle-bg)"
        trackColor="var(--oyk-core-topbar-subtle-bg)"
        thumbColor="linear-gradient(to right, var(--oyk-core-topbar-subtle-fg), var(--oyk-c-primary))"
      />
    </section>
  );
}
