import { useTranslation } from "@/services/translation";

import OykAlert from "./Alert";

export default function OykFormMessage({ errorTitle, hasError, successTitle, hasSuccess, small = false, style }) {
  const { t } = useTranslation();

  return (
    <div className="oyk-form-message" style={style}>
      {hasError && <OykAlert title={errorTitle} message={hasError || t("An error occurred")} variant="danger" small={small} />}
      {hasSuccess && <OykAlert title={successTitle} message={hasSuccess || t("Action completed successfully")} variant="success" small={small} />}
    </div>
  );
}