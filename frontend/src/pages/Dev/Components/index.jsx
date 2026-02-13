import "@/assets/styles/page/_dev-components.scss";

import { useTranslation } from "@/services/translation";
import {
  OykAlert,
  OykAvatar,
  OykButton,
  OykCard,
  OykChip,
  OykFeedback,
  OykGrid,
  OykHeading,
} from "@/components/ui";
import ComponentApiTable from "./ComponentApiTable";

export default function Components() {
  const { t } = useTranslation();

  return (
    <section className="oyk-page oyk-components">
      <OykGrid className="oyk-components-list">
        <article id="predefined-colours" className="oyk-components-list-item">
          <OykHeading title={t("Predefined Colours")} nop />
          <div className="oyk-components-list-item-example">
            <span style={{ color: "var(--oyk-core-fg)" }}>Default text</span>
            <span style={{ color: "var(--oyk-c-primary)" }}>Primary</span>
            <span style={{ color: "var(--oyk-c-danger)" }}>Danger</span>
            <span style={{ color: "var(--oyk-c-success)" }}>Success</span>
            <OykCard
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                width: "100%",
              }}
            >
              <span style={{ color: "var(--oyk-card-fg)" }}>Card default text</span>
              <span style={{ color: "var(--oyk-c-primary)" }}>Primary</span>
              <span style={{ color: "var(--oyk-c-danger)" }}>Danger</span>
              <span style={{ color: "var(--oyk-c-success)" }}>Success</span>
            </OykCard>
          </div>
        </article>

        <article id="alert" className="oyk-components-list-item">
          <OykHeading title={t("Alert")} nop />
          <div className="oyk-components-list-item-example column">
            <OykAlert title="Default Alert" message="Message here" />
            <br />
            <OykAlert title="Primary Alert" message="Message here" variant="primary" />
            <br />
            <OykAlert title="Danger Alert" message="Message here" variant="danger" />
            <br />
            <OykAlert title="Success Alert" message="Message here" variant="success" />
          </div>
          <code className="full">{`<OykAlert title="Title Here" message="Message here" variant="danger" />`}</code>
          <ComponentApiTable
            items={[
              {
                name: "title",
                description: "Title",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "message",
                description: "Message",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "variant",
                description: "Variant",
                type: "string",
                defaultValue: "default",
                enumValue: ["default", "primary", "danger", "warning", "success"],
              },
              {
                name: "showIcon",
                description: "Show icon",
                type: "boolean",
                defaultValue: "true",
              },
              {
                name: "icon",
                description: "Icon",
                type: "component",
                defaultValue: "-",
              },
              {
                name: "iconSize",
                description: "Icon size",
                type: "number",
                defaultValue: "24",
              },
            ]}
          />
        </article>

        <article id="avatar" className="oyk-components-list-item">
          <OykHeading title={t("Avatar")} nop />
          <div className="oyk-components-list-item-example">
            <OykAvatar level={543} /> <OykAvatar size={24} /> <OykAvatar name="John Johnson" /> <OykAvatar abbr="JJ" />{" "}
            <OykAvatar abbr="JJ" size={32} />{" "}
            <OykAvatar src="https://testingbot.com/free-online-tools/random-avatar/140" />{" "}
            <OykAvatar src="https://testingbot.com/free-online-tools/random-avatar/64" name="John Johnson" size={48} />{" "}
            <OykAvatar src="https://testingbot.com/free-online-tools/random-avatar/32" abbr="JD" size={24} />{" "}
            <OykAvatar src="https://testingbot.com/free-online-tools/random-avatar/92" name="John Doe" abbr="JD" />{" "}
          </div>
          <code className="full">{`<OykAvatar name="Name Here" src={url} size={24} />`}</code>
          <ComponentApiTable
            items={[
              {
                name: "name",
                description: "Name to display",
                type: "string",
                defaultValue: '""',
              },
              {
                name: "abbr",
                description: "Abbreviation to display if no src and no icon is provided",
                type: "string",
                defaultValue: '""',
              },
              {
                name: "src",
                description: "Source of the avatar image",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "icon",
                description: "Icon to display if no src is provided",
                type: "component",
                defaultValue: "<User />",
              },
              {
                name: "size",
                description: "Size in pixels",
                type: "number",
                defaultValue: "64",
              },
              {
                name: "bgColor",
                description: "Background colour",
                type: "string",
                defaultValue: "var(--oyk-c-primary)",
              },
              {
                name: "fgColor",
                description: "Colour of the text and icon",
                type: "string",
                defaultValue: "var(--oyk-c-primary-fg)",
              },
              {
                name: "borderColor",
                description: "Border colour",
                type: "string",
                defaultValue: "var(--oyk-card-bg)",
              },
            ]}
          />
        </article>

        <article id="button" className="oyk-components-list-item">
          <OykHeading title={t("Button")} nop />
          <div className="oyk-components-list-item-example">
            <div>
              <OykButton>Default Button</OykButton> <OykButton color="primary">Primary Button</OykButton>{" "}
              <OykButton color="danger">Danger Button</OykButton> <OykButton color="success">Success Button</OykButton>
            </div>
            <div>
              <OykButton outline>Default Button</OykButton>{" "}
              <OykButton outline color="primary">
                Primary Button
              </OykButton>{" "}
              <OykButton outline color="danger">
                Danger Button
              </OykButton>{" "}
              <OykButton outline color="success">
                Success Button
              </OykButton>
            </div>
            <div>
              <OykButton disabled>Default Button</OykButton>{" "}
              <OykButton disabled color="primary">
                Primary Button
              </OykButton>{" "}
              <OykButton disabled color="danger">
                Danger Button
              </OykButton>{" "}
              <OykButton disabled color="success">
                Success Button
              </OykButton>
            </div>
            <OykCard>
              <div>
                <OykButton>Default Button</OykButton> <OykButton color="primary">Primary Button</OykButton>{" "}
                <OykButton color="danger">Danger Button</OykButton> <OykButton color="success">Success Button</OykButton>
              </div>
            </OykCard>
          </div>
          <code className="full">{`<OykButton>Default Button</OykButton>`}</code>
          <ComponentApiTable
            items={[
              {
                name: "children",
                description: "Button content",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "routeName",
                description: "Route name",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "params",
                description: "Route parameters",
                type: "object",
                defaultValue: "{}",
              },
              {
                name: "action",
                description: "Action to perform",
                type: "function",
                defaultValue: "-",
              },
              {
                name: "disabled",
                description: "Disable button",
                type: "boolean",
                defaultValue: "false",
              },
              {
                name: "color",
                description: "Colour",
                type: "string",
                defaultValue: "default",
                enumValue: ["default", "primary", "danger", "warning", "success", "#(hex)"],
              },
              {
                name: "outline",
                description: "Show button with border and without background",
                type: "boolean",
                defaultValue: "false",
              },
              {
                name: "block",
                description: "Make button full width",
                type: "boolean",
                defaultValue: "false",
              },
            ]}
          />
        </article>

        <article id="chip" className="oyk-components-list-item">
          <OykHeading title={t("Chip")} nop />
          <div className="oyk-components-list-item-example column">
            <OykChip>Default Chip</OykChip> <OykChip color="primary">Primary Chip</OykChip>{" "}
            <OykChip color="danger">Danger Chip</OykChip> <OykChip color="success">Success Chip</OykChip>
            <br />
            <OykChip outline>Default Chip</OykChip>{" "}
            <OykChip outline color="primary">
              Primary Chip
            </OykChip>{" "}
            <OykChip outline color="danger">
              Danger Chip
            </OykChip>{" "}
            <OykChip outline color="success">
              Success Chip
            </OykChip>
          </div>
          <code className="full">{`<OykChip>Default Chip</OykChip>`}</code>
          <ComponentApiTable
            items={[
              {
                name: "color",
                description: "Colour",
                type: "string",
                defaultValue: "default",
                enumValue: ["default", "primary", "danger", "warning", "success", "#(hex)"],
              },
              {
                name: "outline",
                description: "Show chip with border and without background",
                type: "boolean",
                defaultValue: "false",
              },
            ]}
          />
        </article>

        <article id="feedback" className="oyk-components-list-item">
          <OykHeading title={t("Feedback")} nop />
          <div
            className="oyk-components-list-item-example"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}
          >
            <OykFeedback title="Default Feedback" message="Message here" />
            <OykFeedback title="Default Feedback" message="Ghost variant" ghost />
            <OykFeedback title="Primary Feedback" message="Message here" variant="primary" />
            <OykFeedback title="Primary Feedback" message="Ghost variant" variant="primary" ghost />
            <OykFeedback title="Danger Feedback" message="Message here" variant="danger" />
            <OykFeedback title="Danger Feedback" message="Ghost variant" variant="danger" ghost />
            <OykFeedback title="Success Feedback" message="Message here" variant="success" />
            <OykFeedback title="Success Feedback" message="Ghost variant" variant="success" ghost />
          </div>
          <code className="full">
            {`<OykFeedback title="Title Here" message="Message here" variant="primary" ghost />`}
          </code>
          <ComponentApiTable
            items={[
              {
                name: "title",
                description: "Title",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "message",
                description: "Message",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "variant",
                description: "Variant",
                type: "string",
                defaultValue: "default",
                enumValue: ["default", "primary", "danger", "warning", "success"],
              },
              {
                name: "showIcon",
                description: "Show icon",
                type: "boolean",
                defaultValue: "true",
              },
              {
                name: "icon",
                description: "Icon",
                type: "component",
                defaultValue: "-",
              },
              {
                name: "iconSize",
                description: "Icon size",
                type: "number",
                defaultValue: "64",
              },
              {
                name: "ghost",
                description: "Show feedback with border and without background",
                type: "boolean",
                defaultValue: "false",
              },
            ]}
          />
        </article>

        <article className="oyk-components-list-item">
          <OykHeading title={t("Heading")} nop />
          <code className="full">{`<OykHeading title={t("Components")} />`}</code>
          <ComponentApiTable
            items={[
              {
                name: "title",
                description: "Title",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "description",
                description: "Description",
                type: "string",
                defaultValue: "-",
              },
              {
                name: "actions",
                description: "Actions",
                type: "component",
                defaultValue: "-",
              },
              {
                name: "ph",
                description: "Horizontal padding",
                type: "number",
                defaultValue: "32",
              },
            ]}
          />
        </article>
      </OykGrid>
    </section>
  );
}