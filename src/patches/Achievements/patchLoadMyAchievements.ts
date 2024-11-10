import { afterPatch } from "@decky/ui";
import { Achievements } from "../../modules/achievements";
import AchievementsManagerCache from "../../AchievementsManagerCache";
import { updateSteamAchievementsCache } from "../../functions";

export default function patchLoadMyAchievements(cache: AchievementsManagerCache) {
  return afterPatch(Achievements.__proto__, "LoadMyAchievements", async function ([appId], ret: Promise<unknown>) {
    const result = await ret;

    const ignored = cache.ignored.get(appId);
    if (!ignored?.size) return result;

    const counters = updateSteamAchievementsCache(appId, ignored);

    if (counters) {
      cache.counters.set(appId, counters);

      await cache.saveCounters();
    }

    return result;
  });
}
