import { beforePatch } from "@decky/ui";
import { Achievements } from "../modules/achievements";

export default function patchGetMyAchievements() {
  return beforePatch(Achievements.__proto__, "GetMyAchievements", (args: Array<number | string | unknown>) => {
    let id = args[0];

    if (typeof id === "number") {
      id = `f${id}`;
    }

    if (typeof id === "string") {
      args[0] = Achievements.m_mapMyAchievements.has(id) ? id : parseInt(id.slice(1));
    }
  });
}
