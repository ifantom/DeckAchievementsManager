import { cloneElement, ReactElement, useContext } from "react";
import { AchievementsPageContext } from "./achievementsPageContextProvider";

export default function AchievementsHeaderWrapper({ children }: { children: ReactElement }) {
  const { countersDiff } = useContext(AchievementsPageContext);

  if (!countersDiff.achieved && !countersDiff.total) return children;

  return cloneElement(children, {
    ...children.props,
    achievements: {
      cEarned: children.props.achievements.cEarned + countersDiff.achieved,
      cTotal: children.props.achievements.cTotal + countersDiff.total,
    },
  });
}
