import { useState } from "react";
import { ButtonItem, PanelSection, PanelSectionRow, Spinner } from "@decky/ui";
import { confirm, resetSteamAchievementsCache, showToast } from "../functions";
import AchievementsManagerCache from "../AchievementsManagerCache";

export default function Content({ cache }: { cache: AchievementsManagerCache }) {
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

  // TODO: Recalculate from game page, or call LoadAchievements for all games in cache
  return (
    <PanelSection title="Is something wrong?">
      <PanelSectionRow>Try to recalculate achievements on Achievements page.</PanelSectionRow>

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
