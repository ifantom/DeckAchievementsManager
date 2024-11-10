import { cloneElement, ReactElement, useContext, useEffect, useState } from "react";
import { Focusable, Menu, MenuItem, showContextMenu } from "@decky/ui";
import { EMPTY_ACHIEVEMENTS_COUNTERS, SteamAchievement } from "../models";
import useIsMounted from "../hooks/useIsMounted";
import { AchievementsPageContext } from "./achievementsPageContextProvider";
import { updateSteamAchievementsCache } from "../functions";
import { Achievements } from "../modules/achievements";
import AchievementsManagerCache from "../AchievementsManagerCache";

export default function AchievementsListWrapper(props: {
  appId: number;
  cache: AchievementsManagerCache;
  children: ReactElement;
}) {
  const mounted = useIsMounted();
  const [ignored, setIgnored] = useState(new Set<SteamAchievement["strID"]>());
  const { countersDiff, setCountersDiff } = useContext(AchievementsPageContext);

  useEffect(() => {
    return () => {
      if (mounted() || !ignored.size) return;

      setCountersDiff({ ...EMPTY_ACHIEVEMENTS_COUNTERS });

      const allIgnored = props.cache.addAppIgnored(props.appId, ignored);
      const calculatedCounters = updateSteamAchievementsCache(props.appId, allIgnored);

      if (calculatedCounters) {
        props.cache.counters.set(props.appId, calculatedCounters);
      }

      props.cache.save();
    };
  }, [mounted]);

  const ignore = async (achievement: SteamAchievement) => {
    ignored.add(achievement.strID);

    countersDiff.total--;
    if (achievement.bAchieved) countersDiff.achieved--;

    setIgnored(new Set(ignored));
    setCountersDiff({ ...countersDiff });
  };

  const handleClick = (achievement: SteamAchievement) => {
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
    rgAchieved: props.children.props.rgAchieved.filter(({ strID }: SteamAchievement) => !ignored.has(strID)),
    rgUnachieved: rgUnachieved.filter(({ strID }: SteamAchievement) => !ignored.has(strID)),
    fnRenderAchievement: (achievement: SteamAchievement) => {
      return (
        <Focusable onClick={() => handleClick(achievement)} onOKButton={() => handleClick(achievement)}>
          {oldRenderAchievementFn(achievement)}
        </Focusable>
      );
    },
  });
}
