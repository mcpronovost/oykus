import { useTranslation } from "@/services/translation";

import OykAlert from "./Alert";

export default function OykFormMessage({ hasError, hasSuccessTitle, hasSuccess, style }) {
  const { t } = useTranslation();

  return (
    <div className="oyk-form-message" style={style}>
      {hasError && <OykAlert title="Error" message={hasError || t("An error occurred")} variant="danger" />}
      {hasSuccess && <OykAlert title={hasSuccessTitle || "Success"} message={hasSuccess || t("Action completed successfully")} variant="success" />}
    </div>
  );
}