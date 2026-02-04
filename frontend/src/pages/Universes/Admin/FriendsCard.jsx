import { useState } from "react";
import { Eye, UserX } from "lucide-react";

import { useRouter } from "@/services/router";
import { OykBanner, OykButton, OykCard } from "@/components/ui";

export default function SettingsFriendsCard({ friend, fetchData = () => {} }) {
  const { n } = useRouter();

  return (
    <li key={friend.slug} className="oyk-settings-friends-list-item">
      <OykCard nop fh alignSpace>
        <header className="oyk-settings-friends-list-item-header">
          <OykBanner avatarSrc={friend.avatar} avatarAbbr={friend.abbr} coverSrc={friend.cover} />
          <div className="oyk-settings-friends-list-item-header-name">
            <span>{friend.name}</span>
          </div>
          <div className="oyk-settings-friends-list-item-header-title">
            <span>Qui ne fait que passer</span>
          </div>
        </header>
        <div className="oyk-settings-friends-list-item-actions">
          <OykButton outline icon={Eye} onClick={() => n("community-user-profile", { userSlug: friend.slug })} />
          <OykButton outline color="danger" icon={UserX} onClick={() => setIsModalFriendsDeleteOpen(true)} />
        </div>
      </OykCard>
    </li>
  );
}
