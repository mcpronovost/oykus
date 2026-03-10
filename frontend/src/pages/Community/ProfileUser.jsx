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

  const handleOpenSite = (url) => {
    if (!url) return;

    window.open(url, "_blank");
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
                      {userData.meta_website || userData.meta_socials ? (<div className="oyk-userprofile-header-social-links">
                        {userData.meta_website && (
                          <OykButton icon={Globe} small onClick={() => handleOpenSite(userData.meta_website)} />
                        )}
                        {userData.meta_socials?.artstation && (
                          <OykButton
                            icon={SiArtstation}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.artstation)}
                          />
                        )}
                        {userData.meta_socials?.bluesky && (
                          <OykButton
                            icon={SiBluesky}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.bluesky)}
                          />
                        )}
                        {userData.meta_socials?.carrd && (
                          <OykButton icon={SiCarrd} small onClick={() => handleOpenSite(userData.meta_socials.carrd)} />
                        )}
                        {userData.meta_socials?.deviantart && (
                          <OykButton
                            icon={SiDeviantart}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.deviantart)}
                          />
                        )}
                        {userData.meta_socials?.facebook && (
                          <OykButton
                            icon={SiFacebook}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.facebook)}
                          />
                        )}
                        {userData.meta_socials?.github && (
                          <OykButton
                            icon={SiGithub}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.github)}
                          />
                        )}
                        {userData.meta_socials?.instagram && (
                          <OykButton
                            icon={SiInstagram}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.instagram)}
                          />
                        )}
                        {userData.meta_socials?.kofi && (
                          <OykButton icon={SiKofi} small onClick={() => handleOpenSite(userData.meta_socials.kofi)} />
                        )}
                        {userData.meta_socials?.linktree && (
                          <OykButton
                            icon={SiLinktree}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.linktree)}
                          />
                        )}
                        {userData.meta_socials?.mastodon && (
                          <OykButton
                            icon={SiMastodon}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.mastodon)}
                          />
                        )}
                        {userData.meta_socials?.patreon && (
                          <OykButton
                            icon={SiPatreon}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.patreon)}
                          />
                        )}
                        {userData.meta_socials?.pinterest && (
                          <OykButton
                            icon={SiPinterest}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.pinterest)}
                          />
                        )}
                        {userData.meta_socials?.reddit && (
                          <OykButton
                            icon={SiReddit}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.reddit)}
                          />
                        )}
                        {userData.meta_socials?.soundcloud && (
                          <OykButton
                            icon={SiSoundcloud}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.soundcloud)}
                          />
                        )}
                        {userData.meta_socials?.spotify && (
                          <OykButton
                            icon={SiSpotify}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.spotify)}
                          />
                        )}
                        {userData.meta_socials?.steam && (
                          <OykButton icon={SiSteam} small onClick={() => handleOpenSite(userData.meta_socials.steam)} />
                        )}
                        {userData.meta_socials?.tiktok && (
                          <OykButton
                            icon={SiTiktok}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.tiktok)}
                          />
                        )}
                        {userData.meta_socials?.twitch && (
                          <OykButton
                            icon={SiTwitch}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.twitch)}
                          />
                        )}
                        {userData.meta_socials?.youtube && (
                          <OykButton
                            icon={SiYoutube}
                            small
                            onClick={() => handleOpenSite(userData.meta_socials.youtube)}
                          />
                        )}
                        {userData.meta_socials?.x && (
                          <OykButton icon={SiX} small onClick={() => handleOpenSite(userData.meta_socials.x)} />
                        )}
                      </div>) : null}
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
                <OykProfileUserFeed user={userData} />
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
