import "@/assets/styles/page/about.scss";
import { useEffect } from "react";

import { useRouter } from "@/services/router";
import { useTranslation } from "@/services/translation";
import { OykGrid, OykHeading } from "@/components/ui";

export default function About() {
  const { routeTitle } = useRouter();
  const { t } = useTranslation();
  
  useEffect(() => {
    const controller = new AbortController();

    routeTitle(t("About"));

    return () => {
      controller.abort();
      routeTitle();
    };
  }, []);

  return (
    <section className="oyk-page oyk-about">
      <OykHeading title={t("About Oykus")} />
      <OykGrid>
        <p>{t("Oykus is a collaborative multiverse project designed to reinvent the way role-playing game universes are created, shared, and experienced. It offers a modern, elegant, and flexible space where each creator can shape their own world, define its rules, lore, and history, then open it to a community of players")}</p>
      </OykGrid>
      <OykHeading title={t("A Living and Interconnected Multiverse")} tag="h2" subtitle />
      <OykGrid>
        <p>{t("At the heart of Oykus is the idea that each universe, as unique as it may be, can resonate with others. Worlds are not isolated: they intersect, collide, and influence each other")}</p>
        <p>{t("Some examples of these narrative links:")}</p>
        <ul>
          <li>
            <p>{t("A gigantic whale from an oceanic universe briefly crosses planes and appears, swimming in the sky of another world")}</p>
          </li>
          <li>
            <p>{t("The satellite of a dystopian sci-fi universe crashes into an elven desert of a fantasy universe")}</p>
          </li>
        </ul>
        <p>{t("These events, big or small, weave a common narrative web and give the multiverse a unique depth")}</p>
      </OykGrid>
      <OykHeading title={t("Tools to Shape Your Universe")} tag="h2" subtitle />
      <OykGrid>
        <p>{t("Oykus offers a series of modules designed to enrich and structure each world:")}</p>
        <ul>
          <li>
            <p><strong>{t("Task planner")}</strong> {t("to organise projects, story arcs, and events")}</p>
          </li>
          <li>
            <p><strong>{t("Integrated blog")}</strong> {t("to publish articles, stories, updates, or lore documents")}</p>
          </li>
          <li>
            <p><strong>{t("Modern forum")}</strong> {t("to host discussions, roleplays, debates, and player interactions")}</p>
          </li>
          <li>
            <p><strong>{t("Item system")}</strong> {t("allowing collection of artefacts, rewards, or resources during activities")}</p>
          </li>
          <li>
            <p><strong>{t("Titles, badges, and achievements")}</strong> {t("to gamify the experience and reward progression")}</p>
          </li>
          <li>
            <p><strong>{t("Customisable game mechanics")}</strong> {t("to adapt rules to the universe")}</p>
          </li>
          <li>
            <p><strong>{t("Individual or global group progression")}</strong> {t("to track players and community evolution")}</p>
          </li>
        </ul>
        <p>{t("Each creator can enable, disable, or configure these modules to offer a perfectly tailored experience for their universe")}</p>
      </OykGrid>
      <OykHeading title={t("A Common Space for All Communities")} tag="h2" subtitle />
      <OykGrid>
        <p>{t("Beyond world creation, Oykus also serves as a meeting point for players from different universes. Communities can exchange, collaborate, discover other play styles, and participate in inter-universe events")}</p>
        <p>{t("This social dimension strengthens the sense of belonging and opens the door to large-scale shared stories")}</p>
      </OykGrid>
      <OykHeading title={t("Modernising Forum Role-Playing")} tag="h2" subtitle />
      <OykGrid>
        <p>{t("Oykus modernizes the text-based role-playing experience by offering:")}</p>
        <ul>
          <li>
            <p>{t("a clear, pleasant, and responsive interface;")}</p>
          </li>
          <li>
            <p>{t("tools designed to streamline writing and roleplay management;")}</p>
          </li>
          <li>
            <p>{t("a modular approach that respects forum role-playing traditions while enriching them")}</p>
          </li>
        </ul>
        <p>{t("The result: an immersive, flexible, and welcoming environment, designed for passionate creators as well as curious players")}</p>
      </OykGrid>
      <OykGrid>
        <p>{t("Oykus is above all a space for imagination, collaboration, and creative freedom. Whether you want to build an entire world or simply explore others, you will find a constantly evolving multiverse shaped by its communities")}</p>
      </OykGrid>
    </section>
  );
}