import { useState } from "react";
import { ButtonItem, PanelSection, PanelSectionRow, Spinner } from "@decky/ui";
import { confirm, resetSteamAchievementsCache, showToast, updateSteamAchievementsCache } from "../functions";
import AchievementsManagerCache from "../AchievementsManagerCache";
import { Achievements } from "../modules/achievements";
import { EMPTY_ACHIEVEMENTS_COUNTERS } from "../models";

export default function Content({ cache }: { cache: AchievementsManagerCache }) {
  const [recalculating, setRecalculating] = useState(false);
  const [resetting, setResetting] = useState(false);

  const reset = async () => {
    const confirmed = await confirm("Are you sure want to reset all changes?", "Reset");
    if (!confirmed) return;

    setResetting(true);
    resetSteamAchievementsCache();
    await cache.clear();

    setResetting(false);
    showToast("Resetting has been done successfully!");
  };

  const recalculate = async () => {
    const confirmed = await confirm("Are you sure want to recalculate cache? It may take a while.", "Recalculate");
    if (!confirmed) return;

    setRecalculating(true);
    resetSteamAchievementsCache();
    await cache.load();

    const promises = [...cache.ignored.entries()].map(async ([appId, ignored]) => {
      if (!ignored.size) {
        cache.counters.set(appId, { ...EMPTY_ACHIEVEMENTS_COUNTERS });
        return;
      }

      if (!Achievements.m_mapMyAchievements.has(appId)) {
        await Achievements.LoadMyAchievements(appId);
      }

      const counters = updateSteamAchievementsCache(appId, ignored);

      if (counters) {
        cache.counters.set(appId, counters);
      }
    });

    await Promise.all(promises);
    await cache.saveCounters();

    setResetting(false);
    showToast("Resetting has been done successfully!");
  };

  return (
    <PanelSection title="Is something wrong?">
      <PanelSectionRow>
        Try to:
        <ButtonItem layout="below" disabled={recalculating} onClick={recalculate}>
          Recalculate cache
          {recalculating && <Spinner width={24} style={{ position: "absolute", top: "8px", right: "8px" }} />}
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        or
        <ButtonItem layout="below" disabled={resetting} onClick={reset}>
          Reset all changes
          {resetting && <Spinner width={24} style={{ position: "absolute", top: "8px", right: "8px" }} />}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}
