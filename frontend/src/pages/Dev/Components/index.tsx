import {
  OykAlert,
  OykCard,
  OykGrid,
  OykHeading,
  OykScrollbar,
  OykTooltip,
} from "@/components/ui";

export default function OykDev() {
  return (
    <OykGrid>
      <OykHeading
        title="Components"
        subtitle="This is a list of all the components in the Oyk UI library."
      />
      <article className="oyk-dev-component">
        <OykHeading
          title="Alert"
          suptitle="Feedback"
          subtitle="Displays a callout for user attention."
        />
        <OykCard>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "600px",
              margin: "8px auto",
            }}
          >
            <OykAlert title="Alert" message="This is an alert" type="default" />
            <OykAlert title="Alert" message="This is an alert" type="accent" />
            <OykAlert title="Alert" message="This is an alert" type="success" />
            <OykAlert title="Alert" message="This is an alert" type="danger" />
            <OykAlert title="Alert" message="This is an alert" type="info" />
            <OykAlert title="Alert" message="This is an alert" type="warning" />
            <OykAlert title="Alert" message="This is an alert" type="special" />
          </div>
        </OykCard>
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
      <article className="oyk-dev-component">
        <OykHeading
          title="Scrollbar"
          suptitle="Data Display"
          subtitle="Custom scrollbar that fills its parent, or uses an explicit height."
        />
        <OykCard>
          <OykScrollbar height={160}>
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index}>
                Scrollable line {index + 1}. Without a height prop, the
                scrollbar fills its parent container instead.
              </p>
            ))}
          </OykScrollbar>
        </OykCard>
      </article>
      <footer style={{ height: 120 }}></footer>
    </OykGrid>
  );
}
