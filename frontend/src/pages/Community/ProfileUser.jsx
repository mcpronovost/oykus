import "@/assets/styles/page/_community-user-profile.scss";
import { useEffect, useState } from "react";

import { api } from "@/services/api";
import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";

import { OykAvatar, OykBanner, OykCard, OykFeedback, OykGrid, OykGridRow, OykGridCol } from "@/components/ui";
import OykAppNotAuthorized from "@/components/core/AppNotAuthorized";

export default function CommunityProfile() {
  const { params, routeTitle } = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (signal) => {
    setIsLoading(true);
    setHasError(null);
    try {
      if (!params?.userSlug) throw new Error(t("User doesn't exist"));
      const r = await api.get(`/auth/users/${params.userSlug}/profile/`, signal ? { signal } : {});
      if (!r?.ok || !r?.user) throw new Error(r.error || t("User doesn't exist"));
      setUserData(r.user);
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
        ) : hasError ? (
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
                  <section className="oyk-userprofile-identity">
                    <h1 className="oyk-userprofile-identity-name">{userData.name}</h1>
                    <small className="oyk-userprofile-identity-title">Qui ne fait que passer</small>
                  </section>
                </OykCard>
              </OykGridCol>
              <OykGridCol col="25">
                <OykCard>aaa</OykCard>
              </OykGridCol>
              <OykGridCol col="50">
                <section className="oyk-userprofile-feed">
                  <article className="oyk-userprofile-feed-post">
                    <OykCard>
                      <div className="oyk-code">
                        Il connaît ce refrain.<br /><br />

                        C'est la nuit qui chantera la future aube. Elle va recouvrir bientôt ; prochainement, dans les heures
                        écoulées, d'un manteau d'ébène tous les édifices. Dans le noir complet, son corps primitif s'animera, le
                        sang pourra affluer normalement jusqu'à ses tempes et ses doigts crochus voudront s'accrocher à
                        quelque chose de vivant. S'enivrer...<br /><br />

                        Servile, c'est une ombre engloutie par ses sœurs. Patient, il siffle juste ses stupides songes, de rêveur
                        perdu. Égaré dans un monde vaste ou ses yeux peines à se poser, moqueurs. Si ce n'est l’amertume
                        d'un souvenir qui refait surface, le silence se charge d'absorber tout ce qui se rapproche un instant des
                        échantillons oniriques. Rev n'a rien d'un adulte ; enfant imprégné du silence, fils des tabous humains.<br /><br />

                        Sa peau blanche est attaquée par le soleil ; rongée par ses rayons ardents. Il brûle, il brille et s'étend sur
                        cette terre, dans les cieux, sur chaque être. Il ordonne et Rev court se cacher hors de ses immenses rais
                        incandescents. Ses morsures lui déchirent l'épiderme, ensanglantée. Et là, où ses mains passent, il le
                        sent, le trou béant au centre de sa poitrine, comme s'il pouvait enfoncer ses ongles à travers la chair ; il
                        entend les bourdonnements qui frémissent. La mécanique infernale ; elle entonne, suiveuse une partition
                        enragée. Enfant sans les mots, ne connaît rien, n'est même pas mélomane. Mais Rev sait chanter,
                        entamer les lugubres requiems.<br /><br />

                        Aujourd'hui, à la nuit tombante, il chantera un peu, comme le voudrait l'ordre qui claque à son oreille.<br /><br />

                        Il serait odieux pour achever cela. Une croix signée au sang des autres. La fin propice de ses couplets
                        fredonnés. Il ouvre enfin les yeux.<br /><br />

                        Il le voit, son cœur palpite d'excitation. Il reconnaît la cible comme on le lui a appris et ses iris fixent
                        ardemment la proie vaincue. Il fait rouler ses muscles jusque-là immobiles ; prêt à attaquer de nouveau.
                        Hors de l'ombre, vers la lumière, celle qui ne filtre dans la soute, il se glisse. Indifférent à l'astre qui le
                        couvrait, une lueur qui ne peut entailler cette armure de glace qui l'entoure au moment d'une altercation.<br />
                        L'heure du face à face. Il s'approche, à délaisser toutes ses affections éphémères, ses scrupules
                        incongrus qu'on lui aura accroché à la veste avant d'en changer. Sa voix pleine de suffisance qui s'abat,
                        entonne sa victoire :<br /><br />

                        ― Debout, Punua, il est l'heure.<br /><br />

                        Ce soir ils iraient festoyer en son honneur.<br /><br />

                        ― Je sais ce que tu vas dire : je ne suis qu'une belle ordure.. .mais tu me remercieras, plus tard.<br /><br />

                        Éclairé par les résidus de suif ; toute la cruauté de son être se déplie dans ses sourires. La colère rougit
                        l'oeil étranger, la flamme en tremble dans son sillage et les ombres tressautent sur le bois. S'en est fini
                        de ses heures perdues dans ces langueurs océanes à border le continent depuis le sud vers le nord; le
                        repos les attendait. Ce ne sont pas les tempêtes détonant dans les artères de l'oahu qui l'inquiètent mais
                        le risque qu'il prendrait à demeurer telle une ombre en retrait.<br /><br />

                        ― Je ne ferais pas les présentations ce soir, mais je te laisse la surprise, j'espère qu'elle te plaira.<br /><br />

                        Attaché, l'homme est traîné dans les ruelles de la citadelle. Cette marche interminable où la crasse lui
                        chatouille la peau et la nuit le happe tout entier. Il est emmené dans le repère des Noir-sang, dans ces
                        couloirs à la pierre froide et centenaire, secoué par ses bourreaux qui le poussent sans relâche. Aucune
                        échappatoire.<br /><br />

                        La salle du trône s'esquisse à leur vue, ses colonnes sombres et l'obscurité qui dévore leurs visages
                        inhumains, éclairés par des flammes vivaces qui bordent une allée centrale. Ils s'avancent prudemment
                        jusqu'aux marches de granite ; devant le trône qui dérange ceux qui se postent frontalement et osent le
                        défier. Ils s'attardent et contemplent la créature assise, à l'allure austère. Son visage est indécelable
                        sous les plis de son capuchon replié sur ses yeux inaccessibles.<br /><br />

                        Les hommes obligent leur prisonnier à poser genou à terre, eux-même s’inclinent avec ferveur.<br /><br />

                        ― Rev Schijn, vous envoie ses salutations, Terje.<br /><br />

                        Un regard vers Punua, avant de dévier vers la silhouette qui les contemple de ses hauteurs insondables.<br /><br />

                        ― Il vous prie d'ailleurs de lui accorder votre clémence pour ne pouvoir venir vous saluer
                        personnellement... il se doit de régler quelques affaires personnelles avant...<br /><br />

                        Le regard qu'ils ne souhaitent pas croiser, en aucun cas, les têtes recourbées fixent le sol, dans une
                        attente glaciale.<br /><br />

                        ― Voici l'homme que vous avez fait demander. La missions a été accomplie.
                      </div>
                    </OykCard>
                  </article>
                  <article className="oyk-userprofile-feed-post">
                    <OykCard>
                      <header className="oyk-userprofile-feed-post-header">
                        <OykAvatar size={48} src={userData.avatar} />
                        <div className="oyk-userprofile-feed-post-header-identity">
                          <div className="oyk-userprofile-feed-post-header-identity-name">
                            <span>{userData.name}</span>
                          </div>
                          <div className="oyk-userprofile-feed-post-header-identity-date">
                            <span>5 hours ago</span>
                          </div>
                        </div>
                      </header>
                      <div className="oyk-code">
                        Il y a tant de choses qui vous passe par la tête lorsque vous êtes seul avec vous-même. Lorsque plus
                        rien ne semble avoir de sens, ou de but, ou de raison. Comme l'instant présent. Il savait le comment, il
                        ignorait le pourquoi. Enfin. Certains doutes étaient plus évidents que d'autres, des doutes à vous en faire
                        reluire l'ego. Mais dans la pénombre crasse des remous de la mer, l'ego ne lui offrit ni chaleur ni
                        réconfort quant à sa situation. Et plus les jours passaient, plus il craignait ce qui lui apparut vite comme
                        une évidence.
                      </div>
                    </OykCard>
                  </article>
                </section>
              </OykGridCol>
              <OykGridCol col="25">
                <OykCard>aaa</OykCard>
              </OykGridCol>
            </OykGridRow>
          </>
        ) : null}
      </OykGrid>
    </section>
  );
}
