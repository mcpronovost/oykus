import "@/assets/styles/page/_community-user-profile.scss";
import { useEffect, useState } from "react";
import { Globe, Pen, UserMinus, UserPlus, UserX } from "lucide-react";
import {
  SiArtstation,
  SiBluesky,
  SiCarrd,
  SiDeviantart,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiKofi,
  SiLinktree,
  SiMastodon,
  SiPatreon,
  SiPinterest,
  SiReddit,
  SiSoundcloud,
  SiSpotify,
  SiSteam,
  SiTiktok,
  SiTwitch,
  SiYoutube,
  SiX,
} from "@icons-pack/react-simple-icons";

import { oykDate, oykUnit } from "@/utils";
import { api } from "@/services/api";
import { useAuth } from "@/services/auth";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";

import {
  OykAlert,
  OykBanner,
  OykButton,
  OykCard,
  OykDataset,
  OykDatasetField,
  OykFeedback,
  OykGrid,
  OykGridRow,
  OykGridCol,
  OykHeading,
} from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";
import OykProfileUserFeed from "./ProfileUserFeed";

export default function CommunityProfile() {
  const { currentUser } = useAuth();
  const { n, params, routeTitle } = useRouter();
  const { t, lang } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCountUniverses, setUserCountUniverses] = useState(0);
  const [userCountPosts, setUserCountPosts] = useState(0);
  const [userCountComments, setUserCountComments] = useState(0);
  const [userCountReactions, setUserCountReactions] = useState(0);

  const fetchUserData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      if (!params?.userSlug) throw new Error(t("User doesn't exist"));
      const r = await api.get(`/auth/users/${params.userSlug}/profile/`, signal ? { signal } : {});
      if (!r?.ok || !r?.user) throw new Error(r.error || t("User doesn't exist"));
      setUserData(r.user);
      setUserCountUniverses(r.user.count_universes_owned);
      setUserCountPosts(r.user.count_blog_posts);
      setUserCountComments(r.user.count_blog_comments);
      setUserCountReactions(r.user.count_blog_reactions);
      routeTitle(r.user.name);
    } catch (e) {
      if (e?.name === "AbortError") return;
      setHasError(() => ({
        message: e.message || t("An error occurred"),
      }));
    } finally {
      if (!signal || !signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const postFriendAdd = async () => {
    if (isLoadingSubmit) return;
    setIsLoadingSubmit(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      const r = await api.post("/social/friends/add/", formData);
      if (!r.ok) throw r;
      setUserData((prev) => ({ ...prev, friend: { status: "pending" } }));
    } catch (e) {
      setHasError(() => ({
        addfriend: t(e?.error) || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const postFriendRequest = async (action) => {
    if (!action) return;

    setIsLoadingSubmit(true);
    setHasError(null);
    try {
      const formData = new FormData();
      formData.append("slug", userData.slug);
      const r = await api.post(`/social/friends/${action}/`, formData);
      if (!r.ok) throw r;
      if (action === "cancel") {
        setUserData((prev) => ({ ...prev, friend: null }));
      } else if (action === "delete") {
        setUserData((prev) => ({ ...prev, friend: null }));
      }
    } catch (e) {
      setHasError(() => ({
        addfriend: t(e?.error) || t("An error occurred"),
      }));
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const handleWebsite = () => {
    if (!userData.meta_website) return;

    window.open(userData.meta_website, "_blank");
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchUserData(controller.signal);

    return () => {
      controller.abort();
      routeTitle();
    };
  }, [params]);

  return (
    <section className="oyk-page oyk-userprofile">
      <OykGrid>
        {hasError && hasError.message == 401 ? (
          <OykAppNotAuthorized />
        ) : hasError?.message ? (
          <OykFeedback ghost variant="danger" title={t("Error")} message={hasError.message} />
        ) : userData && !isLoading ? (
          <>
            <OykGridRow wrap>
              <OykGridCol col="100">
                <OykCard nop>
                  <OykBanner
                    avatarSrc={userData.avatar}
                    avatarSize={200}
                    avatarTop={90}
                    avatarBorderSize={8}
                    coverSrc={userData.cover}
                    coverHeight={256}
                    height={298}
                  />
                  <div className="oyk-userprofile-header">
                    <section className="oyk-userprofile-header-identity">
                      <h1 className="oyk-userprofile-header-identity-name">{userData.name}</h1>
                      <small className="oyk-userprofile-header-identity-title">Qui ne fait que passer</small>
                    </section>
                    <section className="oyk-userprofile-header-stats">
                      <ul>
                        <li>
                          <span>{oykUnit(userCountUniverses, 1)}</span>
                          <span>{t("Universe", userCountUniverses)}</span>
                        </li>
                        <li>
                          <span>{oykUnit(userCountPosts, 1)}</span>
                          <span>{t("Message", userCountPosts)}</span>
                        </li>
                        <li>
                          <span>{oykUnit(userCountComments, 1)}</span>
                          <span>{t("Comment", userCountComments)}</span>
                        </li>
                        <li>
                          <span>{oykUnit(userCountReactions, 1)}</span>
                          <span>{t("Reaction", userCountReactions)}</span>
                        </li>
                      </ul>
                    </section>
                    <section className="oyk-userprofile-header-social">
                      <div className="oyk-userprofile-header-social-actions">
                        {currentUser?.slug === userData.slug ? (
                          <OykButton color="primary" icon={Pen} small onClick={() => n("settings")}>
                            {t("Edit profile")}
                          </OykButton>
                        ) : !userData.friend ? (
                          <OykButton color="primary" icon={UserPlus} small onClick={postFriendAdd}>
                            {t("Add friend")}
                          </OykButton>
                        ) : userData.friend.status === "pending" ? (
                          <OykButton
                            outline
                            color="primary"
                            icon={UserX}
                            small
                            onClick={() => postFriendRequest("cancel")}
                          >
                            {t("Cancel friend request")}
                          </OykButton>
                        ) : userData.friend.status === "accepted" ? (
                          <OykButton
                            outline
                            color="primary"
                            icon={UserMinus}
                            small
                            onClick={() => postFriendRequest("delete")}
                          >
                            {t("Unfriend")}
                          </OykButton>
                        ) : null}
                        {/* currentUser?.slug !== userData.slug && (<OykButton>{t("Follow")}</OykButton>) */}
                      </div>
                      <div className="oyk-userprofile-header-social-links">
                        {userData.meta_website && <OykButton icon={Globe} small onClick={handleWebsite} />}
                        {userData.meta_sites_artstation && <OykButton icon={SiArtstation} small />}
                        {userData.meta_sites_bluesky && <OykButton icon={SiBluesky} small />}
                        {userData.meta_sites_carrd && <OykButton icon={SiCarrd} small />}
                        {userData.meta_sites_deviantart && <OykButton icon={SiDeviantart} small />}
                        {userData.meta_sites_facebook && <OykButton icon={SiFacebook} small />}
                        {userData.meta_sites_github && <OykButton icon={SiGithub} small />}
                        {userData.meta_sites_instagram && <OykButton icon={SiInstagram} small />}
                        {userData.meta_sites_kofi && <OykButton icon={SiKofi} small />}
                        {userData.meta_sites_linktree && <OykButton icon={SiLinktree} small />}
                        {userData.meta_sites_mastodon && <OykButton icon={SiMastodon} small />}
                        {userData.meta_sites_patreon && <OykButton icon={SiPatreon} small />}
                        {userData.meta_sites_pinterest && <OykButton icon={SiPinterest} small />}
                        {userData.meta_sites_reddit && <OykButton icon={SiReddit} small />}
                        {userData.meta_sites_soundcloud && <OykButton icon={SiSoundcloud} small />}
                        {userData.meta_sites_spotify && <OykButton icon={SiSpotify} small />}
                        {userData.meta_sites_steam && <OykButton icon={SiSteam} small />}
                        {userData.meta_sites_tiktok && <OykButton icon={SiTiktok} small />}
                        {userData.meta_sites_twitch && <OykButton icon={SiTwitch} small />}
                        {userData.meta_sites_youtube && <OykButton icon={SiYoutube} small />}
                        {userData.meta_sites_x && <OykButton icon={SiX} small />}
                      </div>
                    </section>
                  </div>
                  {hasError?.addfriend && (
                    <section className="oyk-userprofile-header-error">
                      <OykAlert variant="danger" title={t("Error")} message={hasError.addfriend} />
                    </section>
                  )}
                </OykCard>
              </OykGridCol>
              <OykGridCol col="25">
                <OykCard className="oyk-userprofile-about">
                  <OykHeading subtitle title={t("About")} nop />
                  <p className="oyk-userprofile-about-bio">{userData.meta_bio}</p>
                  <OykDataset small style={{ marginTop: 16 }}>
                    <OykDatasetField
                      term={t("Joined")}
                      value={oykDate(userData.created_at, "date", lang, currentUser?.timezone)}
                    />
                    {userData.meta_country && <OykDatasetField term={t("Country")} value={userData.meta_country} />}
                    {userData.meta_birthday && (
                      <OykDatasetField
                        term={t("Birthday")}
                        value={oykDate(userData.meta_birthday, "truedate", lang, "UTC")}
                      />
                    )}
                    {userData.meta_job && <OykDatasetField term={t("Occupation")} value={userData.meta_job} />}
                    {userData.meta_mood && <OykDatasetField term={t("Mood")} value={userData.meta_mood} />}
                  </OykDataset>
                </OykCard>
              </OykGridCol>
              <OykGridCol col="50">
                <OykProfileUserFeed />
              </OykGridCol>
              <OykGridCol col="25">
                <OykCard style={{ textAlign: "center" }}>...</OykCard>
              </OykGridCol>
            </OykGridRow>
          </>
        ) : null}
      </OykGrid>
    </section>
  );
}
