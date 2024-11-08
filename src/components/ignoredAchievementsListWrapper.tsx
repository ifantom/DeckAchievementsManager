import { cloneElement, ReactElement, useContext, useEffect, useState } from "react";
import { Achievements } from "../modules/achievements";
import { EMPTY_ACHIEVEMENTS_COUNTERS, SteamAppAchievement } from "../models";
import { Focusable, Menu, MenuItem, showContextMenu } from "@decky/ui";
import useIsMounted from "../hooks/useIsMounted";
import { AchievementsPageContext } from "./achievementsPageContextProvider";
import { deleteIgnoredAchievementIds } from "../functions/deleteIgnoredAchievementIds";
import { updateAchievementsCache } from "../functions/updateAchievementsCache";
import { updateAppAchievementsCounters } from "../functions/updateAppAchievementsCounters";

export default function IgnoredAchievementsListWrapper(props: { appId: number; children: ReactElement }) {
  if (!Achievements.m_mapMyAchievements.has(`i${props.appId}`)) {
    return <></>;
  }

  const mounted = useIsMounted();
  const [reconsidered, setReconsidered] = useState(new Set<SteamAppAchievement["strID"]>());
  const { counters, setCounters } = useContext(AchievementsPageContext);

  useEffect(() => {
    return () => {
      if (mounted() || !reconsidered.size) {
        return;
      }

      updateAppAchievementsCounters(props.appId, counters).then();
      deleteIgnoredAchievementIds(props.appId, reconsidered).then((allIgnored) => {
        updateAchievementsCache(props.appId, allIgnored);

        setCounters({ ...EMPTY_ACHIEVEMENTS_COUNTERS });
      });
    };
  }, [mounted]);

  const reconsider = async (achievement: SteamAppAchievement) => {
    reconsidered.add(achievement.strID);
    counters[achievement.bAchieved ? "achieved" : "unachieved"]--;

    setReconsidered(new Set(reconsidered));
    setCounters({ ...counters });
  };

  const handleClick = (achievement: SteamAppAchievement) => {
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
    rgAchieved: props.children.props.rgAchieved.filter(({ strID }: SteamAppAchievement) => !reconsidered.has(strID)),
    rgUnachieved: props.children.props.rgUnachieved.filter(
      ({ strID }: SteamAppAchievement) => !reconsidered.has(strID),
    ),
    fnRenderAchievement: (achievement: SteamAppAchievement) => {
      return (
        <Focusable onClick={() => handleClick(achievement)} onOKButton={() => handleClick(achievement)}>
          {oldRenderAchievementFn(achievement)}
        </Focusable>
      );
    },
  });
}
