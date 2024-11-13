import { findModuleChild } from "@decky/ui";
import { SteamAchievementsCache } from "../models";

export const Achievements: IAchievements = findModuleChild((module) => {
  if (typeof module !== "object") return undefined;
  for (let prop in module) {
    if (module[prop]?.m_mapMyAchievements) return module[prop];
  }
});

interface IAchievements {
  LoadMyAchievements: (appId: number) => Promise<void>;
  m_mapMyAchievements: Map<number | string, SteamAchievementsCache>;
  __proto__: unknown;
}
