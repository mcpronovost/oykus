import { useEffect, useState } from "react";

import { useTranslation } from "@/services/translation";
import { OykButton, OykCard, OykGrid, OykHeading } from "@/components/common";

export default function DevQuests() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [character, setCharacter] = useState({});

  const getLevel = (xp) => {
    if (xp < 1) return 0;
    if (xp < 1024) return 1;
    return Math.floor(Math.log2(xp)) - 9 + 1;
  }

  const getXpForLevel = (xp) => {
    const level = getLevel(xp);
    if (level < 1) return 1;
    return Math.pow(2, level + 9);
  }

  const getPercentForLevel = (xp) => {
    const level = getLevel(xp);
    if (level < 1) return 0;
    
    // Get the XP required for the current level
    const xpForCurrentLevel = Math.pow(2, level + 9);
    // Get the XP required for the previous level
    const xpForPreviousLevel = level > 1 ? Math.pow(2, level + 8) : 0;
    // Calculate XP progress within the current level
    const xpInCurrentLevel = xp - xpForPreviousLevel;
    // Calculate total XP range for the current level
    const xpRangeForLevel = xpForCurrentLevel - xpForPreviousLevel;
    
    return Math.round((xpInCurrentLevel / xpRangeForLevel) * 100);
  }

  const handleQuest1 = (attr, skill) => {
    console.log("Starting Quest 1");
    setIsLoading(true);
    const QuestLevel = 1;
    const QuestXP = 125;
    const SkillLevel = getLevel(character?.skills?.[skill] || 0);
    const LD = (QuestLevel - SkillLevel);
    const Malus = LD * 0.25;
    const SA = getLevel(character?.attributes?.[attr] || 0);
    const AT = 12;
    const Bonus = SA / AT;
    const Mastery = Math.max(0, Bonus - Malus);
    const Destiny = 0.05;
    const SR = Math.max(0, Mastery - Destiny);
    console.log(
      "Malus:", Malus,
      "Bonus:", Bonus,
      "Mastery", Mastery
    );
    console.log("Success Rate:", (SR * 100).toFixed(2), "%");
    const success = Math.random() < SR;
    let SkillXP = QuestXP;
    let AttrXP = QuestXP / 6;
    if (success) {
      console.log("Success!");
    } else {
      SkillXP = SkillXP / 2;
      AttrXP = AttrXP / 2;
      console.log("Failed!");
    }
    setTimeout(() => {
      setCharacter({
        ...character,
        attributes: {
          ...character.attributes,
          [attr]: Math.round((character.attributes[attr] || 0) + AttrXP),
        },
        skills: {
          ...character.skills,
          [skill]: Math.round((character.skills[skill] || 0) + SkillXP),
        },
      });
      setIsLoading(false);
    }, 4000);
  }

  useEffect(() => {
    setCharacter({
      name: "Pachu'a Wapi Qatlaalawsiq",
      abbr: "PWQ",
      slug: "pachua-wapi-qatlaalawsiq",
      resistances: {
        physical: 2,
        mental: 4,
        spiritual: 4,
      },
      attributes: {
        strength: 1,
        constitution: 1,
        dexterity: 1,
        perception: 2048,
        intelligence: 1024,
        willpower: 1024,
      },
      skills: {},
    });
  }, []);

  if (!character?.name) return null;

  return (
    <section className="oyk-page oyk-dev-quests">
      <OykHeading title={t("Quests")} />
      <OykGrid>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div style={{ flex: "1 1 100%" }}>
            <h2>{character.name}</h2>
          </div>
          <OykCard>
            <h3>Résistances</h3>
            <br />
            <ul>
              {Object.entries(character.resistances).map(([resistance, value]) => (
                <li key={resistance}>{resistance}: {value}</li>
              ))}
            </ul>
          </OykCard>
          <OykCard>
            <h3>Attributs</h3>
            <br />
            <ul>
              {Object.entries(character.attributes).map(([attribute, value]) => (
                <li key={attribute}>{attribute}: {getLevel(value)} ({value}/{getXpForLevel(value)} xp) [{getPercentForLevel(value)}%]</li>
              ))}
            </ul>
          </OykCard>
          <OykCard>
            <h3>Compétences</h3>
            <br />
            <ul>
              {Object.entries(character.skills).map(([skill, value]) => (
                <li key={skill}>{skill}: {getLevel(value)} ({value} xp)</li>
              ))}
            </ul>
          </OykCard>
        </div>
        <OykCard>
          <h3>Quêtes</h3>
          <br />
          <ul>
            <li><OykButton color="primary" disabled={isLoading} isLoading={isLoading} action={() => handleQuest1("strength", "woodcutting")}>Start</OykButton> Quête 1: Lvl 1 (strength) [woodcutting]</li>
            <li><OykButton color="primary" disabled={isLoading} isLoading={isLoading} action={() => handleQuest1("constitution", "carrying")}>Start</OykButton> Quête 2: Lvl 1 (constitution) [carrying]</li>
            <li><OykButton color="primary" disabled={isLoading} isLoading={isLoading} action={() => handleQuest1("dexterity", "archery")}>Start</OykButton> Quête 3: Lvl 1 (dexterity) [archery]</li>
            <li><OykButton color="primary" disabled={isLoading} isLoading={isLoading} action={() => handleQuest1("perception", "tracking")}>Start</OykButton> Quête 4: Lvl 1 (perception) [tracking]</li>
            <li><OykButton color="primary" disabled={isLoading} isLoading={isLoading} action={() => handleQuest1("intelligence", "alchemy")}>Start</OykButton> Quête 5: Lvl 1 (intelligence) [alchemy]</li>
            <li><OykButton color="primary" disabled={isLoading} isLoading={isLoading} action={() => handleQuest1("willpower", "negotiation")}>Start</OykButton> Quête 6: Lvl 1 (willpower) [negotiation]</li>
          </ul>
          <br />
          <p>QL - SL = LD x 0,25 = Malus</p>
          <p>SA / AT = Bonus</p>
          <p>AB - LM = M - D = SR</p>
        </OykCard>
      </OykGrid>
    </section>
  );
}
