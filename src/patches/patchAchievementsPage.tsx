import { routerHook } from "@decky/api";
import { cloneElement, createElement, ReactElement } from "react";
import { afterPatch } from "@decky/ui";
import AchievementsHeaderWrapper from "../components/achievementsHeaderWrapper";
import AchievementsListWrapper from "../components/achievementsListWrapper";
import IgnoredAchievementsListWrapper from "../components/ignoredAchievementsListWrapper";
import { AchievementsPageContextProvider } from "../components/achievementsPageContextProvider";

declare global {
  let navigation: { currentEntry: { url: string } };
}

class ManualRouter {
  static get match() {
    const id = navigation.currentEntry.url.match(/app\/(\d+)\//)?.[1];

    return { params: { appid: Number(id) } };
  }
}

export default function patchAchievementsPage() {
  return routerHook.addPatch("/library/app/:appid/achievements", () => {
    // @ts-ignore
    const childrenFn: Function = (routerHook.toReplace as Map<string, unknown>).get("/library/app/:appid/achievements");
    const childrenEl = createElement(childrenFn.bind(undefined, ManualRouter), {});

    afterPatch(childrenEl, "type", (_, ret1) => {
      const appId: number = ret1.props.appid;

      afterPatch(ret1, "type", (_, ret2: ReactElement) => {
        const mine = ret2.props.children.props.children[1].props.children.props.children[0];

        afterPatch(mine.props.children, "type", (_, ret3: ReactElement) => {
          ret3.props.children[0].props.children = (
            <AchievementsHeaderWrapper>{ret3.props.children[0].props.children}</AchievementsHeaderWrapper>
          );

          const myAchievementsTab = ret3.props.children[1].props.children.props.tabs.find(
            ({ id }: { id: string }) => id === "achievements",
          );

          if (!myAchievementsTab) {
            return ret3;
          }

          const ignoredAchievementsTab = {
            ...myAchievementsTab,
            id: "all",
            title: "Ignored achievements",
            content: cloneElement(myAchievementsTab.content, {
              ...myAchievementsTab.content.props,
              appid: `i${myAchievementsTab.content.props.appid}`,
            }),
          };

          ret3.props.children[1].props.children.props.tabs.push(ignoredAchievementsTab);

          afterPatch(myAchievementsTab.content, "type", (_, ret4: ReactElement) => {
            ret4.props.children.splice(
              1,
              2,
              <AchievementsListWrapper appId={appId}>{ret4.props.children[1]}</AchievementsListWrapper>,
            );

            return ret4;
          });

          afterPatch(ignoredAchievementsTab.content, "type", (_, ret4: ReactElement) => {
            ret4.props.children.splice(
              1,
              2,
              <IgnoredAchievementsListWrapper appId={appId}>{ret4.props.children[1]}</IgnoredAchievementsListWrapper>,
            );

            return ret4;
          });

          return <AchievementsPageContextProvider>{ret3}</AchievementsPageContextProvider>;
        });

        return ret2;
      });

      return ret1;
    });

    return { children: childrenEl };
  });
}
