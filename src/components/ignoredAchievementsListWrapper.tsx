import { cloneElement, ReactElement, useContext, useEffect, useState } from "react";
import { Achievements } from "../modules/achievements";
import { EMPTY_ACHIEVEMENTS_COUNTERS, SteamAchievement } from "../models";
import { Focusable, Menu, MenuItem, showContextMenu } from "@decky/ui";
import useIsMounted from "../hooks/useIsMounted";
import { AchievementsPageContext } from "./achievementsPageContextProvider";
import { updateSteamAchievementsCache } from "../functions";
import AchievementsManagerCache from "../AchievementsManagerCache";

export default function IgnoredAchievementsListWrapper(props: {
  appId: number;
  cache: AchievementsManagerCache;
  children: ReactElement;
}) {
  if (!Achievements.m_mapMyAchievements.has(`i${props.appId}`)) {
    return <></>;
  }

  const mounted = useIsMounted();
  const [reconsidered, setReconsidered] = useState(new Set<SteamAchievement["strID"]>());
  const { countersDiff, setCountersDiff } = useContext(AchievementsPageContext);

  useEffect(() => {
    return () => {
      if (mounted() || !reconsidered.size) return;

      setCountersDiff({ ...EMPTY_ACHIEVEMENTS_COUNTERS });

      const allIgnored = props.cache.deleteAppIgnored(props.appId, reconsidered);
      const calculatedCounters = updateSteamAchievementsCache(props.appId, allIgnored);

      if (calculatedCounters) {
        props.cache.counters.set(props.appId, calculatedCounters);
      }

      props.cache.save();
    };
  }, [mounted]);

  const reconsider = async (achievement: SteamAchievement) => {
    reconsidered.add(achievement.strID);

    countersDiff.total++;
    if (achievement.bAchieved) countersDiff.achieved++;

    setReconsidered(new Set(reconsidered));
    setCountersDiff({ ...countersDiff });
  };

  const handleClick = (achievement: SteamAchievement) => {
    showContextMenu(
      <Menu label={achievement.strName}>
        <MenuItem disabled={true}>Ignore</MenuItem>
        <MenuItem onSelected={() => reconsider(achievement)}>Reconsider</MenuItem>
      </Menu>,
    );
  };

  const oldRenderAchievementFn = props.children.props.fnRenderAchievement;

  return cloneElement(props.children, {
    ...props.children.props,
    rgAchieved: props.children.props.rgAchieved.filter(({ strID }: SteamAchievement) => !reconsidered.has(strID)),
    rgUnachieved: props.children.props.rgUnachieved.filter(({ strID }: SteamAchievement) => !reconsidered.has(strID)),
    fnRenderAchievement: (achievement: SteamAchievement) => {
      return (
        <Focusable onClick={() => handleClick(achievement)} onOKButton={() => handleClick(achievement)}>
          {oldRenderAchievementFn(achievement)}
        </Focusable>
      );
    },
  });
}
