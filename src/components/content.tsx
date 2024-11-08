import { useState } from "react";
import { ButtonItem, ConfirmModal, PanelSection, PanelSectionRow, showModal, Spinner } from "@decky/ui";
import { getAchievementsCountersIndex } from "../functions/getAchievementsCountersIndex";
import { Achievements } from "../modules/achievements";
import localforage from "localforage";
import { showToast } from "../functions/showToast";
import { getIgnoredAchievementIds } from "../functions/getIgnoredAchievementIds";
import { updateAchievementsCache } from "../functions/updateAchievementsCache";

export default function Content() {
  const [resetting, setResetting] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  const reset = async () => {
    const confirmed = await new Promise((resolve) => {
      showModal(
        <ConfirmModal
          strTitle="Achievements Manager"
          strDescription="Are you sure want to reset all changes?"
          strOKButtonText="Reset"
          onOK={() => resolve(true)}
          onCancel={() => resolve(false)}
        />,
      );
    });

    if (!confirmed) {
      return;
    }

    setResetting(true);

    const index = await getAchievementsCountersIndex();
    const appIds = Object.keys(index).map(Number);

    appIds.forEach((appId) => {
      appAchievementProgressCache.m_achievementProgress?.mapCache?.delete(`f${appId}`);
      Achievements.m_mapMyAchievements.delete(`f${appId}`);
      Achievements.m_mapMyAchievements.delete(`i${appId}`);
    });

    await localforage.clear();

    setResetting(false);

    showToast("Resetting has been done successfully!");
  };

  const recalculate = async () => {
    const confirmed = await new Promise((resolve) => {
      showModal(
        <ConfirmModal
          strTitle="Achievements Manager"
          strDescription="Are you sure want to recalculate cache?"
          strOKButtonText="Recalculate"
          onOK={() => resolve(true)}
          onCancel={() => resolve(false)}
        />,
      );
    });

    if (!confirmed) {
      return;
    }

    const index = await getAchievementsCountersIndex();
    const appIds = Object.keys(index).map(Number);

    if (appIds.length) {
      setRecalculating(true);

      const promises = appIds.map(async (appId) => {
        appAchievementProgressCache.m_achievementProgress?.mapCache?.delete(`f${appId}`);
        Achievements.m_mapMyAchievements.delete(`f${appId}`);
        Achievements.m_mapMyAchievements.delete(`i${appId}`);

        const ignored = await getIgnoredAchievementIds(appId);

        updateAchievementsCache(appId, ignored);
      });

      await Promise.all(promises);

      setRecalculating(false);
    }

    showToast("Recalculating has been done successfully!");
  };

  return (
    <PanelSection title="Is something wrong?">
      <PanelSectionRow>
        Try to:
        <ButtonItem layout="below" bottomSeparator="none" disabled={recalculating} onClick={recalculate}>
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
