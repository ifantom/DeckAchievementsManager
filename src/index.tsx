import { staticClasses } from "@decky/ui";
import { definePlugin, routerHook } from "@decky/api";
import { FaTrophy } from "react-icons/fa";
import * as localforage from "localforage";
import patchLoadMyAchievements from "./patches/Achievements/patchLoadMyAchievements";
import patchGetMyAchievements from "./patches/Achievements/patchGetMyAchievements";
import patchAchievementsPage from "./patches/patchAchievementsPage";
import patchGetAchievementProgress from "./patches/appAchievementProgressCache/patchGetAchievementProgress";
import { SteamAchievementProgressCache } from "./models";
import patchGetAchievements from "./patches/appDetailsStore/patchGetAchievements";
import Content from "./components/content";
import AchievementsManagerCache from "./AchievementsManagerCache";

// TODO: i18n
const STORAGE_KEY = "achievements-manager-db";
localforage.config({ name: STORAGE_KEY });

declare global {
  let appAchievementProgressCache: {
    m_mapQueuedCacheMisses: Map<number, boolean>;
    m_achievementProgress?: { mapCache?: Map<number | string, SteamAchievementProgressCache> };
    GetAchievementProgress: (appId: number) => number;
    SaveCacheFile: () => Promise<void>;
    __proto__: any;
  };

  let appDetailsStore: {
    __proto__: any;
    GetAchievements(appId: number): unknown;
    GetAppData(appId: number): unknown;
  };
}

export default definePlugin(() => {
  const cache = new AchievementsManagerCache();

  console.time("Achievements Manager cache has been loaded: ");
  cache.load().then(() => console.timeEnd("Achievements Manager cache has been loaded: "));

  const patches = {
    appAchievementProgressCache: {
      GetAchievementProgress: patchGetAchievementProgress(cache),
    },

    Achievements: {
      LoadMyAchievements: patchLoadMyAchievements(cache),
      GetMyAchievements: patchGetMyAchievements(),
    },

    appDetailsStore: {
      GetAchievements: patchGetAchievements(),
    },
  };

  const achievementsPagePatch = patchAchievementsPage(cache);

  return {
    name: "Achievements Manager",
    titleView: <div className={staticClasses.Title}>Achievements Manager</div>,
    content: <Content cache={cache} />,
    icon: <FaTrophy />,
    onDismount() {
      Object.values(patches).forEach((source) => {
        Object.values(source).forEach((patch) => patch.unpatch());
      });

      routerHook.removePatch("/library/app/:appid/achievements", achievementsPagePatch);
    },
  };
});
