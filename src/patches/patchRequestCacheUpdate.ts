import { replacePatch } from "@decky/ui";
import { getAchievementsCountersIndex } from "../functions/getAchievementsCountersIndex";
import { updateProgressCache } from "../functions/updateProgressCache";

export default function patchRequestCacheUpdate() {
  const patch = replacePatch(appAchievementProgressCache.__proto__, "RequestCacheUpdate", async () => {
    const requested = new Map(appAchievementProgressCache.m_mapQueuedCacheMisses);

    await patch.original.call(appAchievementProgressCache);

    const index = await getAchievementsCountersIndex();

    Object.entries(index).forEach(([appId, counters]) => {
      if (requested.has(Number(appId))) {
        updateProgressCache(Number(appId), counters);
      }
    });
  });

  return patch;
}
