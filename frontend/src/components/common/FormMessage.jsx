import { useTranslation } from "@/services/translation";

import OykAlert from "./Alert";

export default function OykFormMessage({ hasError, style }) {
  const { t } = useTranslation();

  return (
    <div className="oyk-form-message" style={style}>
      {hasError && <OykAlert title="Error" message={hasError || t("An error occurred")} variant="danger" />}
    </div>
  );
}