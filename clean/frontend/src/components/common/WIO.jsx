import { useTranslation } from "@/services/translation";
import { OykAlert, OykAvatar, OykGrid, OykHeading, OykLink, OykLoading } from "@/components/ui";

export default function OykWIO({ users = [], guests = 0, isLoading = false, hasError = null }) {
  const { t } = useTranslation();

  return (
    <>
      <OykHeading title={t("Who is online?")} tag="h2" subtitle />
      <OykGrid>
        {hasError ? (
          <OykAlert
            title={t("An error occurred")}
            message={t("Unable to access who is online data, check your internet connection or try again later")}
            variant="danger"
          />
        ) : !isLoading ? (
          <>
            <section style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              {users?.length
                ? users.map((u) => (
                    <OykLink key={u.slug} routeName={"community-user-profile"} params={{ userSlug: u.slug }}>
                      <OykAvatar name={u.name} abbr={u.abbr} src={u.avatar} borderSize={6} size={48} />
                    </OykLink>
                  ))
                : null}
              {guests ? (
                <OykAvatar abbr={`+${guests}`} bgColor="var(--oyk-card-bg)" fgColor="var(--oyk-card-fg)" size={32} />
              ) : null}
            </section>
          </>
        ) : (
          <OykLoading />
        )}
      </OykGrid>
    </>
  );
}
