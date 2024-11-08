import { afterPatch } from "@decky/ui";
import { Achievements } from "../modules/achievements";
import { getIgnoredAchievementIds } from "../functions/getIgnoredAchievementIds";
import { AchievementsCacheData } from "../models";

export default function patchLoadMyAchievements() {
  return afterPatch(Achievements.__proto__, "LoadMyAchievements", async function ([appId], ret: Promise<unknown>) {
    const ignored = await getIgnoredAchievementIds(appId);
    const result = await ret;

    if (!ignored.size || !Achievements.m_mapMyAchievements.has(appId)) {
      return result;
    }

    const allAchievements: AchievementsCacheData | undefined = Achievements.m_mapMyAchievements.get(appId)?.data;

    if (!allAchievements) {
      return result;
    }

    const filteredAchievements: AchievementsCacheData = {
      achieved: { ...allAchievements.achieved },
      unachieved: { ...allAchievements.unachieved, ...allAchievements.hidden },
      hidden: {},
    };
    const ignoredAchievements: AchievementsCacheData = { achieved: {}, hidden: {}, unachieved: {} };

    ignored.forEach((id) => {
      if (filteredAchievements.achieved[id]) {
        ignoredAchievements.achieved[id] = filteredAchievements.achieved[id];
        delete filteredAchievements.achieved[id];
        return;
      }

      if (filteredAchievements.unachieved[id]) {
        ignoredAchievements.unachieved[id] = filteredAchievements.unachieved[id];
        delete filteredAchievements.unachieved[id];
        return;
      }
    });

    Achievements.m_mapMyAchievements.set(`f${appId}`, { data: filteredAchievements });
    Achievements.m_mapMyAchievements.set(`i${appId}`, { data: ignoredAchievements });

    return result;
  });
}
