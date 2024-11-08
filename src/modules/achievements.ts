import { findModuleChild } from "@decky/ui";
import { AchievementsCache } from "../models";

export const Achievements: IAchievements = findModuleChild((module) => {
  if (typeof module !== "object") return undefined;
  for (let prop in module) {
    if (module[prop]?.m_mapMyAchievements) return module[prop];
  }
});

interface IAchievements {
  m_mapMyAchievements: Map<number | string, AchievementsCache>;
  __proto__: unknown;
}
