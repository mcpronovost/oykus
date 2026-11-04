# Navigation and menu

Product decisions for how the shell separates global navigation from page-relative menus.

## Navigation (sidebar)

**Navigation** lives in the core sidebar. It switches between major areas of the current workspace.

The first list of links is the **world-building** tools:

| Link | Role |
| --- | --- |
| **Dashboard** | Stories and goals overview |
| **Encyclopedia** | Entries such as characters, flora, lore, events, races, countries, and similar |
| **Notes** | Ideas, references, inspirations, quotes, and similar |

Other sidebar lists (plugins such as Manuscript, Forum, Game, plus Settings) are separate from this world-building group. See [spaces and current workspace](./spaces-and-workspace.md) for when space-scoped links are disabled.

## Menu (header)

**Menu** lives in the core header and is **relative to the current page**. It does not replace sidebar navigation; it exposes sections or filters inside the page you are already on.

Examples:

- On **Encyclopedia**, the menu might include Timeline, Characters, World, and similar.
- On **Notes**, the menu might include Notes, References, and similar.

When the current page has no page-relative sections, the header menu can be empty or omitted.
