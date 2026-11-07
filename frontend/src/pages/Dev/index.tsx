import { OykAlert, OykGrid, OykHeading, OykTooltip } from "@/components/ui";

export default function OykDev() {
  return (
    <OykGrid>
      <header className="oyk-heading">
        <h1>Components</h1>
        <p>This is a list of all the components in the Oyk UI library.</p>
      </header>
      <article className="oyk-dev-component">
        <OykHeading
          title="Alert"
          suptitle="Feedback"
          subtitle="Displays a callout for user attention."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <OykAlert title="Alert" message="This is an alert" type="default" />
          <OykAlert title="Alert" message="This is an alert" type="accent" />
          <OykAlert title="Alert" message="This is an alert" type="success" />
          <OykAlert title="Alert" message="This is an alert" type="danger" />
          <OykAlert title="Alert" message="This is an alert" type="info" />
          <OykAlert title="Alert" message="This is an alert" type="warning" />
          <OykAlert title="Alert" message="This is an alert" type="special" />
        </div>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Tooltip"
          suptitle="Feedback"
          subtitle="Display prompt information for mouse hover."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <OykTooltip content="This is a tooltip" placement="top" />
          <OykTooltip content="This is a tooltip" placement="right" />
          <OykTooltip content="This is a tooltip" placement="bottom" />
          <OykTooltip content="This is a tooltip" placement="left" />
        </div>
      </article>
    </OykGrid>
  );
}
