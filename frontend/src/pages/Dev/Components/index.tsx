import {
  OykAlert,
  OykButton,
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
        <OykCard>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              padding: "24px 16px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto auto",
                gridTemplateRows: "auto auto auto",
                gap: "12px",
                placeItems: "center",
              }}
            >
              <span />
              <OykTooltip content="Appears above the trigger" placement="top">
                <OykButton label="Top" />
              </OykTooltip>
              <span />
              <OykTooltip content="Appears to the left" placement="left">
                <OykButton label="Left" />
              </OykTooltip>
              <span style={{ opacity: 0.5, fontSize: "0.875rem" }}>Hover me</span>
              <OykTooltip content="Appears to the right" placement="right">
                <OykButton label="Right" />
              </OykTooltip>
              <span />
              <OykTooltip content="Appears below the trigger" placement="bottom">
                <OykButton label="Bottom" />
              </OykTooltip>
              <span />
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "24px",
                alignItems: "center",
              }}
            >
              <OykTooltip content="Dotted underline marks inline help" hint placement="top">
                <span>What is a space?</span>
              </OykTooltip>
              <OykTooltip content="You should not see this" disabled placement="top">
                <OykButton label="Disabled" disabled />
              </OykTooltip>
              <OykTooltip
                content={
                  <span>
                    Save changes to your <strong>world</strong>
                  </span>
                }
                placement="top"
              >
                <OykButton label="Rich content" />
              </OykTooltip>
            </div>
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Scrollbar"
          suptitle="Navigation"
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
