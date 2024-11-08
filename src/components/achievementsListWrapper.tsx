import { cloneElement, ReactElement, useContext, useEffect, useState } from "react";
import { Focusable, gamepadContextMenuClasses, Menu, MenuItem, showContextMenu } from "@decky/ui";
import { EMPTY_ACHIEVEMENTS_COUNTERS, SteamAppAchievement } from "../models";
import useIsMounted from "../hooks/useIsMounted";
import { AchievementsPageContext } from "./achievementsPageContextProvider";
import { addIgnoredAchievementIds } from "../functions/addIgnoredAchievementIds";
import { updateAchievementsCache } from "../functions/updateAchievementsCache";
import { updateAppAchievementsCounters } from "../functions/updateAppAchievementsCounters";
import { callable } from "@decky/api";
import { Achievements } from "../modules/achievements";
import confirm from "../functions/confirm";

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
    counters[achievement.bAchieved ? "achieved" : "unachieved"]++;

    setIgnored(new Set(ignored));
    setCounters({ ...counters });
  };

  const unlock = async (achievement: SteamAppAchievement) => {
    const confirmed = confirm('Are you sure want to unlock the achievement? This action cannot be undone', 'Unlock');

    if (!confirmed) return;

    const callApi = callable<[app_id: string, achievement_name: string], string>("unlock");
    await callApi(`${props.appId}`, achievement.strID);
  };

  const showStatsContextMenu = async (achievement: SteamAppAchievement) => {
    const result = await callable<[app_id: string], string>("get_stats")(`${props.appId}`);
    if (!result) return;

    const index = result.indexOf("STATS\n");
    if (index === -1) return;

    const options = result
      .slice(index)
      .split("\n")
      .slice(2, -2)
      .map((line) => {
        const buffer = line.trim().split(/\s+/);

        return { name: buffer[0], number: buffer[2] };
      })
      .filter(({ number }) => {
        return `${achievement.flCurrentProgress}` === number;
      });

    if (!options.length) return;

    showContextMenu(
      <Menu label="Choose stat to fix">
        <div
          className={gamepadContextMenuClasses.contextMenuItem + " disabled"}
          style={{ display: "block", pointerEvents: "none", minWidth: "320px" }}
        >
          <div
            className="_1WP2YDDWrL5LPHoS04AKx8"
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "-4px 0 6px",
            }}
          >
            Achievement
            <div style={{ paddingLeft: "16px", color: "rgba(255,255,255,.3)" }}>{achievement.strID}</div>
          </div>

          {achievement.strName}
          <div className="_1WP2YDDWrL5LPHoS04AKx8" style={{ color: "inherit", marginBottom: "-4px" }}>
            {achievement.strDescription}
          </div>
        </div>

        <div className={gamepadContextMenuClasses.ContextMenuSeparator}></div>

        {options.map(({ name }) => (
          <MenuItem onClick={() => fixStat(name, achievement.flMaxProgress)}>
            {name}
            <div style={{ marginInlineStart: "auto" }}>{achievement.flCurrentProgress}</div>
          </MenuItem>
        ))}
      </Menu>,
    );
  };

  const fixStat = async (name: string, value: number) => {
    const callApi = callable<[app_id: string, stat_name: string, stat_value: string], string>("set_stat");
    await callApi(`${props.appId}`, name, `${value}`);
  };

  const handleClick = (achievement: SteamAppAchievement) => {
    showContextMenu(
      <Menu label={achievement.strName}>
        <MenuItem onSelected={() => ignore(achievement)}>Ignore</MenuItem>
        <MenuItem disabled={true}>Reconsider</MenuItem>

        <div className={gamepadContextMenuClasses.ContextMenuSeparator}></div>

        <MenuItem disabled={achievement.bAchieved} onClick={() => unlock(achievement)}>
          Unlock
        </MenuItem>

        {achievement.bAchieved && achievement.flCurrentProgress < achievement.flMaxProgress && (
          <MenuItem onClick={() => showStatsContextMenu(achievement)}>Fix stats</MenuItem>
        )}
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
