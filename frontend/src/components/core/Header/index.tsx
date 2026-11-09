import { IconBell } from "@tabler/icons-react";
import { useAuth } from "@/services/auth";
import { OykButton, OykSpacer } from "@/components/ui";
import OykCoreHeaderBrand from "./HeaderBrand";
import OykCoreHeaderMenu from "./HeaderMenu";
import OykCoreHeaderUser from "./HeaderUser";

export default function OykCoreHeader() {
  const { isAuth } = useAuth();

  if (!isAuth) return null;

  return (
    <div className="oyk-core-header">
      <OykCoreHeaderBrand />
      <OykCoreHeaderMenu />
      <OykSpacer />
      <div className="oyk-core-header-social">
        <OykButton icon={IconBell} iconSize={19} variant="plain" shrink />
      </div>
      <OykCoreHeaderUser />
    </div>
  );
}
