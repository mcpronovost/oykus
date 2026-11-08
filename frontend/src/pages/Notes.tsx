import { useState } from "react";
import { OykButton, OykForm, OykGrid, OykHeading } from "@/components/ui";
import { OykMasonry } from "@/components/common";

export default function OykNotes() {
  const [formNote, setFormNote] = useState({
    title: "",
    category: "",
  });

  const handleChangeFormNote = (name: string, value: string) => {
    setFormNote({ ...formNote, [name]: value });
  };

  return (
    <div className="oyk-page-notes">
      <OykGrid>
        <OykHeading title="Notes" />
        <OykForm>
          <OykGrid.Row nop>
            <OykGrid.Col size={{ xs: 24, sm: 6, md: 4 }}>
              <OykForm.Field
                name="category"
                placeholder="Select category"
                type="multiselect"
                value={formNote.category}
                onChange={(value) =>
                  handleChangeFormNote("category", value as string)
                }
                options={[
                  { label: "Category 1", value: "1" },
                  { label: "Category 2", value: "2" },
                  { label: "Category 3", value: "3" },
                ]}
              />
            </OykGrid.Col>
            <OykGrid.Col size={{ xs: 24, sm: 12, md: 16 }}>
              <OykForm.Field
                name="title"
                placeholder="Capture an idea, a quote, a question, or a thought..."
                value={formNote.title}
                onChange={(value) =>
                  handleChangeFormNote("title", value as string)
                }
              />
            </OykGrid.Col>
            <OykGrid.Col size={{ xs: 24, sm: 6, md: 4 }}>
              <OykButton type="submit" label="Add Note" color="accent" grow />
            </OykGrid.Col>
          </OykGrid.Row>
        </OykForm>
        <OykMasonry />
      </OykGrid>
    </div>
  );
}
