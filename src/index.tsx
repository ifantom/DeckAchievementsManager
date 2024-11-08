import { staticClasses } from "@decky/ui";
import { definePlugin, routerHook } from "@decky/api";
import { FaTrophy } from "react-icons/fa";
import * as localforage from "localforage";
import patchLoadMyAchievements from "./patches/patchLoadMyAchievements";
import patchGetMyAchievements from "./patches/patchGetMyAchievements";
import patchAchievementsPage from "./patches/patchAchievementsPage";
import patchGetAchievementProgress from "./patches/patchGetAchievementProgress";
import { AchievementProgressCache } from "./models";
import patchLoadCacheFile from "./patches/patchLoadCacheFile";
import patchRequestCacheUpdate from "./patches/patchRequestCacheUpdate";
import patchGetAchievements from "./patches/patchGetAchievements";
import Content from "./components/content";

// TODO: i18n
const STORAGE_KEY = "achievements-manager-db";
localforage.config({ name: STORAGE_KEY });

declare global {
  let appAchievementProgressCache: {
    m_mapQueuedCacheMisses: Map<number, boolean>;
    m_achievementProgress?: { mapCache?: Map<number | string, AchievementProgressCache> };
    GetAchievementProgress: (appId: number) => number;
    __proto__: any;
  };

  let appDetailsStore: {
    __proto__: any;
    GetAchievements(appId: number): unknown;
    GetAppData(appId: number): unknown;
  };
}

export default definePlugin(() => {
  const patches = {
    appAchievementProgressCache: {
      LoadCacheFile: patchLoadCacheFile(),
      RequestCacheUpdate: patchRequestCacheUpdate(),
      GetAchievementProgress: patchGetAchievementProgress(),
    },

    Achievements: {
      LoadMyAchievements: patchLoadMyAchievements(),
      GetMyAchievements: patchGetMyAchievements(),
    },

    appDetailsStore: {
      GetAchievements: patchGetAchievements(),
    },
  };

  const achievementsPagePatch = patchAchievementsPage();

  return {
    name: "Achievements Manager",
    titleView: <div className={staticClasses.Title}>Achievements Manager</div>,
    content: <Content />,
    icon: <FaTrophy />,
    onDismount() {
      Object.values(patches).forEach((source) => {
        Object.values(source).forEach((patch) => patch.unpatch());
      });

      routerHook.removePatch("/library/app/:appid/achievements", achievementsPagePatch);
    },
  };
});
