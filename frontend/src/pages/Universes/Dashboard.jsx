import { useEffect, useState } from "react";
import { Component, MessagesSquare, Share2 } from "lucide-react";

import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { useWorld } from "@/services/world";
import { oykUnit } from "@/utils";

import { OykCard, OykFeedback, OykGrid, OykGridRow, OykGridCol, OykProgressCircular } from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";

export default function OykUniverseDashboard() {
  const { isAuth } = useAuth();
  const { params } = useRouter();
  const { t } = useTranslation();
  const { currentUniverse, changeUniverse } = useWorld();

  const nonRenewableResources = [];
  const exploitations = [
    {
      id: 1,
      name: "Mine du domaine Kur",
      location: "Kshirsagar - Ladkani",
      total: 5000,
      remain: 5000,
      workers: 30,
      ressource: {
        id: 1,
        name: "Hématite",
        place: "Mine",
        workers_min: 30,
        workers_max: 120,
        qty_per_year: 800,
      },
    }
  ];

  useEffect(() => {
    if (!isAuth || !currentUniverse || currentUniverse.role !== 1) return;

    const controller = new AbortController();

    // TODO: Fetch dashboard data

    return () => {
      controller.abort();
    };
  }, []);

  if (!isAuth || !currentUniverse || currentUniverse.role !== 1) {
    return <OykAppNotAuthorized />;
  }

  return (
    <section className="oyk-page oyk-universe-dashboard">
      <OykGrid full>
        <OykGridRow wrap>
          {nonRenewableResources.map((ressource) => (
            <OykGridCol key={ressource.name} col="15" md="33">
              <OykCard
                fh
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--oyk-card-subtle-bg)",
                    borderRadius: "8px",
                    flex: "0 0 48px",
                    width: 48,
                    height: 48,
                  }}
                >
                  {/* TODO: Add icon */}
                </div>
                <div style={{ flex: "1 1 auto" }}>
                  <div>
                    {oykUnit(ressource.remaining, 1)} <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>tonnes</span>
                  </div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>{ressource.name} restant</div>
                </div>
                <div style={{ flex: "0 0 48px", justifyItems: "flex-end", width: 48 }}>
                  <OykProgressCircular progress={((ressource.remaining) * 100) / ressource.total} size={48} borderSize={6} />
                </div>
              </OykCard>
            </OykGridCol>
          ))}
        </OykGridRow>
      </OykGrid>
    </section>
  );
}
