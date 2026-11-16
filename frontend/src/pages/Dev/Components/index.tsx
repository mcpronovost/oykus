import { useState } from "react";
import {
  IconBell,
  IconBook,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import {
  OykAlert,
  OykButton,
  OykCard,
  OykChip,
  OykClamp,
  OykCode,
  OykDialog,
  OykDivider,
  OykDrawer,
  OykForm,
  OykGrid,
  OykHeading,
  OykLink,
  OykList,
  OykModal,
  OykProgressBar,
  OykResult,
  OykScrollbar,
  OykSpacer,
  OykStats,
  OykTooltip,
} from "@/components/ui";

const COLORS = [
  "default",
  "accent",
  "success",
  "danger",
  "info",
  "warning",
  "special",
] as const;

const SELECT_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const MULTI_OPTIONS = [
  { value: "fantasy", label: "Fantasy" },
  { value: "scifi", label: "Science fiction" },
  { value: "horror", label: "Horror" },
  { value: "mystery", label: "Mystery" },
];

export default function OykDev() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    notes: "",
    status: "",
    genres: [] as string[],
    agree: false,
  });

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

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
            {COLORS.map((c) => (
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
          {COLORS.map((c) => (
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
              <OykButton color={c} label="Start Icon" start={IconSettings} />
              <OykButton color={c} start={IconBell} shrink />
              <OykButton color={c} label="Disabled" disabled />
              <OykButton color={c} label="Pill" variant="pill" />
              <OykButton color={c} start={IconSettings} variant="pill" shrink />
              <OykButton color={c} label="Flat" variant="flat" />
              <OykButton color={c} start={IconSettings} variant="flat" shrink />
              <OykButton color={c} label="Ghost" variant="ghost" />
              <OykButton color={c} start={IconSettings} variant="ghost" shrink />
              <OykButton color={c} label="Plain" variant="plain" shrink />
              <OykButton color={c} start={IconSettings} variant="plain" shrink />
            </div>
          ))}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              padding: "8px",
            }}
          >
            <OykButton label="Small" size="sm" />
            <OykButton label="Medium" size="md" />
            <OykButton label="Large" size="lg" />
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Card"
          suptitle="Layout"
          subtitle="Surface container for grouping related content."
        />
        <OykCard>
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <OykCard>
              <p style={{ margin: 0 }}>Default padding</p>
            </OykCard>
            <OykCard outlined>
              <p style={{ margin: 0 }}>Outlined</p>
            </OykCard>
            <OykCard hoverable>
              <p style={{ margin: 0 }}>Hoverable</p>
            </OykCard>
            <OykCard gradient="accent">
              <p style={{ margin: 0 }}>Accent gradient</p>
            </OykCard>
            <OykCard color="success" pad="lg">
              <p style={{ margin: 0 }}>Coloured + large pad</p>
            </OykCard>
            <OykCard nop>
              <p style={{ margin: 0 }}>No padding</p>
            </OykCard>
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Chip"
          suptitle="Data Display"
          subtitle="Compact label for tags, filters, and status."
        />
        <OykCard>
          {COLORS.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "8px",
              }}
            >
              <OykChip label={c} color={c} />
              <OykChip label="Pill" color={c} variant="pill" />
              <OykChip label="Outline" color={c} variant="outline" />
              <OykChip label="Ghost" color={c} variant="ghost" />
              <OykChip label="Clickable" color={c} clickable />
              <OykChip label="Small" color={c} size="sm" />
              <OykChip label="Large" color={c} size="lg" />
            </div>
          ))}
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Clamp"
          suptitle="Typography"
          subtitle="Truncates overflowing text to a fixed number of lines."
        />
        <OykCard>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {([1, 2, 3] as const).map((lines) => (
              <div key={lines}>
                <p style={{ margin: "0 0 8px", opacity: 0.7 }}>
                  {lines} line{lines > 1 ? "s" : ""}
                </p>
                <OykClamp lines={lines}>
                  The northern marches were once a quiet borderland, until the
                  rift opened and spilled starlight into the valleys. Merchants
                  still travel the old road, though fewer each season, and those
                  who return speak of cities that rebuild themselves overnight.
                </OykClamp>
              </div>
            ))}
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Code"
          suptitle="Typography"
          subtitle="Renders Oyk markup into styled rich text."
        />
        <OykCard>
          <OykCode>
            {[
              "Plain prose with [g]bold[/g], [i]italic[/i] and [b]strike[/b].",
              "",
              "[c=accent]Aligned block with an accent colour.[/c]",
              "[ac]Centred callout for a short aside.[/ac]",
            ].join("\n")}
          </OykCode>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Dialog"
          suptitle="Feedback"
          subtitle="Anchored popover panel triggered by a click."
        />
        <OykCard>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "24px",
              padding: "16px",
            }}
          >
            {(["top", "right", "bottom", "left"] as const).map((placement) => (
              <OykDialog
                key={placement}
                placement={placement}
                content={({ close }) => (
                  <div style={{ minWidth: 180, padding: 4 }}>
                    <p style={{ margin: "0 0 12px" }}>
                      Dialog placed {placement}.
                    </p>
                    <OykButton label="Close" size="sm" onClick={close} />
                  </div>
                )}
              >
                <OykButton label={placement} />
              </OykDialog>
            ))}
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Divider"
          suptitle="Layout"
          subtitle="Horizontal rule with optional labels."
        />
        <OykCard>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <OykDivider />
            <OykDivider label="or" />
            <OykDivider start="Active" end="3 items" />
            <OykDivider start="Accent" color="accent" />
            <OykDivider label="No padding" nop />
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Drawer"
          suptitle="Feedback"
          subtitle="Slide-in panel for previews and secondary workflows."
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
              label="Open drawer"
              color="accent"
              onClick={() => setDrawerOpen(true)}
            />
          </div>
          <OykDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title="Example drawer"
            suptitle="Preview"
            headerIcon={IconBook}
            content={
              <p style={{ margin: 0 }}>
                Drawers keep the page context visible while you inspect or edit
                a related record.
              </p>
            }
            actions={({ close }) => (
              <>
                <OykButton label="Cancel" variant="ghost" onClick={close} />
                <OykButton label="Done" color="accent" onClick={close} />
              </>
            )}
          />
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Form"
          suptitle="Data Entry"
          subtitle="Validated fields for text, select, checkbox, and more."
        />
        <OykCard>
          <OykForm
            onSubmit={() => undefined}
            style={{ maxWidth: 480, margin: "0 auto" }}
          >
            <OykForm.Field
              name="name"
              label="Name"
              placeholder="Ada Lovelace"
              required
              value={form.name}
              onChange={(value) => updateField("name", String(value))}
              helptext="Displayed on your public profile."
            />
            <OykForm.Field
              name="email"
              type="email"
              label="Email"
              placeholder="ada@oykus.app"
              value={form.email}
              onChange={(value) => updateField("email", String(value))}
              icon={IconBell}
            />
            <OykForm.Field
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={(value) => updateField("password", String(value))}
              helplist={[
                {
                  label: "At least 8 characters",
                  test: (value) => value.length >= 8,
                },
                {
                  label: "Contains a number",
                  test: (value) => /\d/.test(value),
                },
              ]}
            />
            <OykForm.Field
              name="notes"
              type="textarea"
              label="Notes"
              placeholder="Optional notes…"
              value={form.notes}
              onChange={(value) => updateField("notes", String(value))}
            />
            <OykForm.Field
              name="status"
              type="select"
              label="Status"
              placeholder="Choose a status"
              options={SELECT_OPTIONS}
              value={form.status}
              onChange={(value) => updateField("status", String(value))}
            />
            <OykForm.Field
              name="genres"
              type="multiselect"
              label="Genres"
              placeholder="Pick genres"
              options={MULTI_OPTIONS}
              value={form.genres}
              onChange={(value) =>
                updateField("genres", Array.isArray(value) ? value : [])
              }
              min={1}
              max={3}
            />
            <OykForm.Field
              name="agree"
              type="checkbox"
              label="Agreements"
              value={form.agree}
              onChange={(value) => updateField("agree", Boolean(value))}
            >
              I agree to the demo terms
            </OykForm.Field>
            <OykForm.Alert
              success="Looks good so far."
              successTitle="Demo alert"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <OykButton
                type="button"
                label="Reset"
                variant="ghost"
                onClick={() =>
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    notes: "",
                    status: "",
                    genres: [],
                    agree: false,
                  })
                }
              />
              <OykButton type="submit" label="Submit" color="accent" />
            </div>
          </OykForm>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Grid"
          suptitle="Layout"
          subtitle="Responsive 24-column row and column layout."
        />
        <OykCard>
          <OykGrid.Row>
            <OykGrid.Col size={24}>
              <OykCard color="accent" pad="sm">
                size 24
              </OykCard>
            </OykGrid.Col>
          </OykGrid.Row>
          <OykGrid.Row>
            <OykGrid.Col size={12}>
              <OykCard color="info" pad="sm">
                size 12
              </OykCard>
            </OykGrid.Col>
            <OykGrid.Col size={12}>
              <OykCard color="success" pad="sm">
                size 12
              </OykCard>
            </OykGrid.Col>
          </OykGrid.Row>
          <OykGrid.Row>
            <OykGrid.Col size={8}>
              <OykCard color="warning" pad="sm">
                size 8
              </OykCard>
            </OykGrid.Col>
            <OykGrid.Col size={8}>
              <OykCard color="danger" pad="sm">
                size 8
              </OykCard>
            </OykGrid.Col>
            <OykGrid.Col size={8}>
              <OykCard color="special" pad="sm">
                size 8
              </OykCard>
            </OykGrid.Col>
          </OykGrid.Row>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Heading"
          suptitle="Typography"
          subtitle="Page and section titles with optional icon and actions."
        />
        <OykCard>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <OykHeading
              title="Default heading"
              suptitle="Suptitle"
              subtitle="Supporting subtitle copy."
              actions={<OykButton label="Action" size="sm" start={IconPlus} />}
            />
            <OykHeading
              title="Card heading"
              subtitle="Used inside cards and panels."
              variant="card"
              tag="h2"
              icon={IconBook}
            />
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Link"
          suptitle="Navigation"
          subtitle="In-app route links and external anchors."
        />
        <OykCard>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "24px",
              padding: "16px",
            }}
          >
            <OykLink routeName="dashboard">Dashboard route</OykLink>
            <OykLink href="https://oykus.app" target="_blank" rel="noreferrer">
              External href
            </OykLink>
            <OykLink disabled>Disabled link</OykLink>
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="List"
          suptitle="Data Display"
          subtitle="Displays a list of items."
        />
        <OykCard>
          <p>This is a list of items.</p>
          <OykList>
            <OykList.Item
              content="1,200 words of manuscript"
              start={IconSettings}
              color="danger"
            />
            <OykList.Item
              content="1 characters and their relationships"
              end={IconSettings}
            />
            <OykList.Item
              content="1 notes and 1 references"
              start={IconSettings}
              end={IconSettings}
            />
          </OykList>
          <p>This was a list of items.</p>
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
      <article className="oyk-dev-component">
        <OykHeading
          title="ProgressBar"
          suptitle="Data Display"
          subtitle="Shows completion as a coloured fill."
        />
        <OykCard>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: 480,
              margin: "0 auto",
              width: "100%",
            }}
          >
            {(
              [
                ["danger", 25],
                ["warning", 50],
                ["info", 75],
                ["success", 100],
              ] as const
            ).map(([color, value]) => (
              <div key={color}>
                <p style={{ margin: "0 0 8px", opacity: 0.7 }}>
                  {color} · {value}%
                </p>
                <OykProgressBar value={value} color={color} />
              </div>
            ))}
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Result"
          suptitle="Feedback"
          subtitle="Empty, loading, and status states with an icon."
        />
        <OykCard>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <OykResult
              title="Nothing here"
              message="Create something to get started."
              variant="ghost"
            />
            <OykResult
              title="Saved"
              message="Your changes are live."
              color="success"
              variant="ghost"
            />
            <OykResult
              title="Something went wrong"
              message="Please try again."
              color="danger"
              variant="ghost"
              closable
            />
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
      <article className="oyk-dev-component">
        <OykHeading
          title="Spacer"
          suptitle="Layout"
          subtitle="Flexible gap that pushes siblings apart in a flex row."
        />
        <OykCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px",
            }}
          >
            <OykButton label="Start" size="sm" />
            <OykSpacer />
            <OykButton label="End" size="sm" color="accent" />
          </div>
        </OykCard>
      </article>
      <article className="oyk-dev-component">
        <OykHeading
          title="Stats"
          suptitle="Data Display"
          subtitle="Inline key-value metrics."
        />
        <OykCard>
          <OykStats justify="start">
            <OykStats.Item label="Notes" value={12} />
            <OykStats.Item label="Characters" value={48} valueColor="accent" />
            <OykStats.Item label="Locations" value={9} valueColor="info" />
            <OykStats.Item label="Events" value={3} valueColor="warning" />
          </OykStats>
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
      <footer style={{ height: 120 }}></footer>
    </OykGrid>
  );
}
