import { createContext, Dispatch, ReactElement, SetStateAction, useState } from "react";
import { AppAchievementsCounters, EMPTY_ACHIEVEMENTS_COUNTERS } from "../models";

export const AchievementsPageContext = createContext({
  counters: { ...EMPTY_ACHIEVEMENTS_COUNTERS },
  setCounters: (() => {}) as Dispatch<SetStateAction<AppAchievementsCounters>>,
});

export function AchievementsPageContextProvider(props: { children: ReactElement }) {
  const [counters, setCounters] = useState({ ...EMPTY_ACHIEVEMENTS_COUNTERS });

  return (
    <AchievementsPageContext.Provider value={{ counters, setCounters }}>
      {props.children}
    </AchievementsPageContext.Provider>
  );
}
