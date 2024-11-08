import { afterPatch } from "@decky/ui";
import { getAchievementsCountersIndex } from "../functions/getAchievementsCountersIndex";
import { updateProgressCache } from "../functions/updateProgressCache";

export default function patchLoadCacheFile() {
  return afterPatch(appAchievementProgressCache.__proto__, "LoadCacheFile", async (_, ret: Promise<unknown>) => {
    const index = await getAchievementsCountersIndex();

    Object.entries(index).forEach(([appId, counters]) => {
      updateProgressCache(Number(appId), counters);
    });

    return ret;
  });
}
