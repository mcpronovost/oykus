import { useTranslation } from "@/services/translation";
import { OykResult } from "@/components/common";
import { OykGrid } from "@/components/ui";

export default function OykDevLaboratory() {
  const { t } = useTranslation();

  return (
    <div className="oyk-dev-laboratory">
      <OykGrid>
        <h1>Laboratory</h1>
        <code style={{ whiteSpace: "pre-wrap" }}>
          {`
/
├── /dashboard
│   └── /goals
├── /library
│   ├── /timeline
│   ├── /characters
│   └── /world
└── /notes
    └── /references
          `}
        </code>
      </OykGrid>
    </div>
  );
}
