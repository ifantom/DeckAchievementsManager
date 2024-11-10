import { afterPatch } from "@decky/ui";
import AchievementsManagerCache from "../../AchievementsManagerCache";

export default function patchGetAchievementProgress(cache: AchievementsManagerCache) {
  return afterPatch(
    appAchievementProgressCache.__proto__,
    "GetAchievementProgress",
    ([appId]: Array<number>, ret: number) => {
      const counters = cache.counters.get(appId);

      if (counters) {
        return counters.achieved / counters.total * 100;
      }

      return ret;
    },
  );
}
