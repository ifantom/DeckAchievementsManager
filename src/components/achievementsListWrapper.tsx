import { cloneElement, ReactElement, useContext, useEffect, useState } from "react";
import { Focusable, Menu, MenuItem, showContextMenu } from "@decky/ui";
import { EMPTY_ACHIEVEMENTS_COUNTERS, SteamAppAchievement } from "../models";
import useIsMounted from "../hooks/useIsMounted";
import { AchievementsPageContext } from "./achievementsPageContextProvider";
import { addIgnoredAchievementIds } from "../functions/addIgnoredAchievementIds";
import { updateAchievementsCache } from "../functions/updateAchievementsCache";
import { updateAppAchievementsCounters } from "../functions/updateAppAchievementsCounters";
import { Achievements } from "../modules/achievements";

export default function AchievementsListWrapper(props: { appId: number; children: ReactElement }) {
  const mounted = useIsMounted();
  const [ignored, setIgnored] = useState(new Set<SteamAppAchievement["strID"]>());
  const { counters, setCounters } = useContext(AchievementsPageContext);

  useEffect(() => {
    return () => {
      if (mounted() || !ignored.size) {
        return;
      }

      updateAppAchievementsCounters(props.appId, counters).then();
      addIgnoredAchievementIds(props.appId, ignored).then((allIgnored) => {
        updateAchievementsCache(props.appId, allIgnored);

        setCounters({ ...EMPTY_ACHIEVEMENTS_COUNTERS });
      });
    };
  }, [mounted]);

  const ignore = async (achievement: SteamAppAchievement) => {
    ignored.add(achievement.strID);
    counters[achievement.bAchieved ? "iAchieved" : "iUnachieved"]++;

    setIgnored(new Set(ignored));
    setCounters({ ...counters });
  };

  const handleClick = (achievement: SteamAppAchievement) => {
    showContextMenu(
      <Menu label={achievement.strName}>
        <MenuItem onSelected={() => ignore(achievement)}>Ignore</MenuItem>
        <MenuItem disabled={true}>Reconsider</MenuItem>
      </Menu>,
    );
  };

  let rgUnachieved = props.children.props.rgUnachieved;

  // Add hidden to unachieved if there is no custom cache
  if (!Achievements.m_mapMyAchievements.has(`f${props.appId}`)) {
    if (Achievements.m_mapMyAchievements.has(props.appId)) {
      const hidden = Object.values(Achievements.m_mapMyAchievements.get(props.appId)?.data?.hidden ?? []);

      rgUnachieved = [...rgUnachieved, ...hidden];
    }
  }

  const oldRenderAchievementFn = props.children.props.fnRenderAchievement;

  return cloneElement(props.children, {
    ...props.children.props,
    rgAchieved: props.children.props.rgAchieved.filter(({ strID }: SteamAppAchievement) => !ignored.has(strID)),
    rgUnachieved: rgUnachieved.filter(({ strID }: SteamAppAchievement) => !ignored.has(strID)),
    fnRenderAchievement: (achievement: SteamAppAchievement) => {
      return (
        <Focusable onClick={() => handleClick(achievement)} onOKButton={() => handleClick(achievement)}>
          {oldRenderAchievementFn(achievement)}
        </Focusable>
      );
    },
  });
}
