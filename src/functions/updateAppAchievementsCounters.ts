import { AppAchievementsCounters, EMPTY_ACHIEVEMENTS_COUNTERS } from "../models";
import { getAchievementsCountersIndex } from "./getAchievementsCountersIndex";
import localforage from "localforage";

export async function updateAppAchievementsCounters(appId: number, diff: AppAchievementsCounters): Promise<void> {
  const index = await getAchievementsCountersIndex();
  const counters = index[appId] ?? { ...EMPTY_ACHIEVEMENTS_COUNTERS };

  counters.achieved += diff.achieved;
  counters.unachieved += diff.unachieved;

  index[appId] = counters;

  await localforage.setItem("counters", index);
}
