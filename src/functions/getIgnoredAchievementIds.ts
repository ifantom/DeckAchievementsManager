import localforage from "localforage";
import { SteamAppAchievement } from "../models";

export async function getIgnoredAchievementIds(appId: number): Promise<Set<SteamAppAchievement["strID"]>> {
  const ids = await localforage.getItem<SteamAppAchievement["strID"][]>(`i${appId}`);

  return new Set(ids ?? []);
}
