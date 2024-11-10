export interface SteamAchievementsCache {
  data: SteamAchievementsCacheData;
}

export interface SteamAchievementsCacheData {
  achieved: Record<string, SteamAchievement>;
  unachieved: Record<string, SteamAchievement>;
  hidden: Record<string, SteamAchievement>;
}

export interface SteamAchievement {
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
  nAchieved: number;
  nTotal: number;
  vecAchievedHidden: SteamAchievement[];
  vecHighlight: SteamAchievement[];
  vecUnachieved: SteamAchievement[];
}

export interface SteamAchievementProgressCache {
  all_unlocked: boolean;
  appid: number;
  cache_time: number;
  percentage: number;
  total: number;
  unlocked: number;
  vetted: boolean;
}

export interface AppAchievementsCounters {
  achieved: number;
  total: number;
}

export const EMPTY_ACHIEVEMENTS_COUNTERS: AppAchievementsCounters = { achieved: 0, total: 0 };




