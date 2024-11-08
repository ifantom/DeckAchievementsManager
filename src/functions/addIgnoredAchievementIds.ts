import localforage from "localforage";
import { SteamAppAchievement } from "../models";
import { getIgnoredAchievementIds } from "./getIgnoredAchievementIds";

export async function addIgnoredAchievementIds(
  appId: number,
  achievementIds: SteamAppAchievement["strID"][] | Set<SteamAppAchievement["strID"]>,
): Promise<Set<SteamAppAchievement["strID"]>> {
  const ids = await getIgnoredAchievementIds(appId);

  achievementIds.forEach((id) => ids.add(id));

  await localforage.setItem<SteamAppAchievement["strID"][]>(`i${appId}`, [...ids]);

  return ids;
}
