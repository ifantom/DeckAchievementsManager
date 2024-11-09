export interface AchievementsCache {
  data: AchievementsCacheData;
}

export interface AchievementProgressCache {
  all_unlocked: boolean;
  appid: number;
  cache_time: number;
  percentage: number;
  total: number;
  unlocked: number;
  vetted: boolean;
}

export interface AchievementsCacheData {
  achieved: Record<string, SteamAppAchievement>;
  unachieved: Record<string, SteamAppAchievement>;
  hidden: Record<string, SteamAppAchievement>;
}

export interface AppAchievementsCounters {
  iAchieved: number;
  iUnachieved: number;
}

export type AchievementsCountersIndex = Record<number, AppAchievementsCounters>;

export const EMPTY_ACHIEVEMENTS_COUNTERS: AppAchievementsCounters = { iAchieved: 0, iUnachieved: 0 };

export interface SteamAppAchievement {
  strID: string;
  strName: string;
  strDescription: string;
  bAchieved: boolean;
  rtUnlocked: number;
  strImage: string;
  bHidden: boolean;
  flMinProgress: number;
  flCurrentProgress: number;
  flMaxProgress: number;
  flAchieved: number;
}

export interface SteamAppAchievements {
  nAchieved: number
  nTotal: number
  vecAchievedHidden: SteamAppAchievement[]
  vecHighlight: SteamAppAchievement[]
  vecUnachieved: SteamAppAchievement[]
}