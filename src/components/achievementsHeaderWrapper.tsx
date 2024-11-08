import { cloneElement, ReactElement, useContext } from "react";
import { AchievementsPageContext } from "./achievementsPageContextProvider";

export default function AchievementsHeaderWrapper({ children }: { children: ReactElement }) {
  const { counters } = useContext(AchievementsPageContext);

  if (!counters.unachieved && !counters.achieved) {
    return children;
  }

  return cloneElement(children, {
    ...children.props,
    achievements: {
      cEarned: children.props.achievements.cEarned - counters.achieved,
      cTotal: children.props.achievements.cTotal - counters.achieved - counters.unachieved,
    },
  });
}
