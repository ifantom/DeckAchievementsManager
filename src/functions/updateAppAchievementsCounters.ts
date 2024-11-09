import { AppAchievementsCounters, EMPTY_ACHIEVEMENTS_COUNTERS } from "../models";
import { getAchievementsCountersIndex } from "./getAchievementsCountersIndex";
import localforage from "localforage";

export async function updateAppAchievementsCounters(appId: number, diff: AppAchievementsCounters): Promise<void> {
  const index = await getAchievementsCountersIndex();
  const counters = index[appId] ?? { ...EMPTY_ACHIEVEMENTS_COUNTERS };

  counters.iAchieved += diff.iAchieved;
  counters.iUnachieved += diff.iUnachieved;

  index[appId] = counters;

  await localforage.setItem("counters", index);
}
