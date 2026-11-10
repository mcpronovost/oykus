import { useState } from "react";
import { IconBell, IconPlus, IconSettings } from "@tabler/icons-react";
import {
  OykAlert,
  OykButton,
  OykCard,
  OykGrid,
  OykHeading,
  OykModal,
  OykScrollbar,
  OykTooltip,
} from "@/components/ui";

export default function OykDev() {
  const [modalOpen, setModalOpen] = useState(false);

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
          <div>
            {[
              "default",
              "accent",
              "success",
              "danger",
              "info",
              "warning",
              "special",
            ].map((c) => (
              <div key={c} style={{ margin: "16px 0" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <OykAlert title="This is an alert" color={c} />
                  <OykAlert
                    title="Alert"
                    message="This is an alert"
                    color={c}
                  />
                  <OykAlert
                    title="Alert"
                    message="This is an alert"
                    color={c}
                    variant="ghost"
                  />
                  <OykAlert
                    title="Alert"
                    message="This is an alert"
                    color={c}
                    variant="ghost"
                    closable
                  />
                  <OykAlert
                    title="This is a closable alert"
                    color={c}
                    variant="ghost"
                    closable
                  />
                </div>
              </div>
            ))}
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Button"
          suptitle="General"
          subtitle="Triggers an action or navigates to a route."
        />
        <OykCard>
          {[
            "default",
            "accent",
            "success",
            "danger",
            "info",
            "warning",
            "special",
          ].map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "8px",
              }}
            >
              <OykButton color={c} label="Default" />
              <OykButton color={c} label="Start Icon" icon={IconSettings} />
              <OykButton color={c} icon={IconBell} shrink />
              <OykButton color={c} label="Disabled" disabled />
              <OykButton color={c} label="Pill" variant="pill" />
              <OykButton color={c} icon={IconSettings} variant="pill" shrink />
              <OykButton color={c} label="Flat" variant="flat" />
              <OykButton color={c} icon={IconSettings} variant="flat" shrink />
              <OykButton color={c} label="Ghost" variant="ghost" />
              <OykButton color={c} icon={IconSettings} variant="ghost" shrink />
              <OykButton color={c} label="Plain" variant="plain" shrink />
              <OykButton color={c} icon={IconSettings} variant="plain" shrink />
            </div>
          ))}
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
              <span style={{ opacity: 0.5, fontSize: "0.875rem" }}>
                Hover me
              </span>
              <OykTooltip content="Appears to the right" placement="right">
                <OykButton label="Right" />
              </OykTooltip>
              <span />
              <OykTooltip
                content="Appears below the trigger"
                placement="bottom"
              >
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
              <OykTooltip
                content="Dotted underline marks inline help"
                hint
                placement="top"
              >
                <span>What is a space?</span>
              </OykTooltip>
              <OykTooltip
                content="You should not see this"
                disabled
                placement="top"
              >
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
          title="Modal"
          suptitle="Feedback"
          subtitle="Centred overlay dialog for focused user tasks."
        />
        <OykCard>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <OykButton
              label="Open modal"
              color="accent"
              onClick={() => setModalOpen(true)}
            />
          </div>
          <OykModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Example modal"
            content={
              <p style={{ margin: 0 }}>
                Use a modal for confirmations, forms, or short focused
                workflows that should block the page behind them.
              </p>
            }
            actions={({ close }) => (
              <>
                <OykButton label="Cancel" variant="ghost" onClick={close} />
                <OykButton label="Confirm" color="accent" onClick={close} />
              </>
            )}
          />
        </OykCard>
      </article>
      <footer style={{ height: 120 }}></footer>
    </OykGrid>
  );
}
