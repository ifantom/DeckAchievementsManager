import { createContext, Dispatch, ReactElement, SetStateAction, useState } from "react";
import { AppAchievementsCounters, EMPTY_ACHIEVEMENTS_COUNTERS } from "../models";

export const AchievementsPageContext = createContext({
  countersDiff: { ...EMPTY_ACHIEVEMENTS_COUNTERS },
  setCountersDiff: (() => {}) as Dispatch<SetStateAction<AppAchievementsCounters>>,
});

export function AchievementsPageContextProvider(props: { children: ReactElement }) {
  const [countersDiff, setCountersDiff] = useState({ ...EMPTY_ACHIEVEMENTS_COUNTERS });

  return (
    <AchievementsPageContext.Provider value={{ countersDiff, setCountersDiff }}>
      {props.children}
    </AchievementsPageContext.Provider>
  );
}
