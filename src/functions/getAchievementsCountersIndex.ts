import localforage from "localforage";
import { AchievementsCountersIndex, AppAchievementsCounters } from "../models";

export async function getAchievementsCountersIndex(): Promise<AchievementsCountersIndex> {
  return (await localforage.getItem<Record<number, AppAchievementsCounters>>("counters")) ?? {};
}
