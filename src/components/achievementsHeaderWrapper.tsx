import { cloneElement, ReactElement, useContext } from "react";
import { AchievementsPageContext } from "./achievementsPageContextProvider";

export default function AchievementsHeaderWrapper({ children }: { children: ReactElement }) {
  const { counters } = useContext(AchievementsPageContext);

  if (!counters.iUnachieved && !counters.iAchieved) {
    return children;
  }

  return cloneElement(children, {
    ...children.props,
    achievements: {
      cEarned: children.props.achievements.cEarned - counters.iAchieved,
      cTotal: children.props.achievements.cTotal - counters.iAchieved - counters.iUnachieved,
    },
  });
}
