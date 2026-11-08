import { useState } from "react";
import { OykForm, OykGrid } from "@/components/ui";

export default function OykNotes() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="oyk-page-notes">
      <OykGrid>
        <OykForm>
          <OykGrid.Row>
            <OykGrid.Col size={4}>
              <OykForm.Field
                name="category"
                placeholder="Select category"
                type="select"
                value={category}
                onChange={(value) => setCategory(value as string)}
                options={[
                  { label: "Category 1", value: "1" },
                  { label: "Category 2", value: "2" },
                  { label: "Category 3", value: "3" },
                ]}
              />
            </OykGrid.Col>
            <OykGrid.Col size={20}>
              <OykForm.Field
                name="title"
                placeholder="Enter title"
                value={title}
                onChange={(value) => setTitle(value as string)}
              />
            </OykGrid.Col>
          </OykGrid.Row>
        </OykForm>
      </OykGrid>
    </div>
  );
}
