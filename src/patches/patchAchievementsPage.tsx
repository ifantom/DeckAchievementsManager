import { routerHook } from "@decky/api";
import { cloneElement, createElement, ReactElement } from "react";
import { afterPatch } from "@decky/ui";
import AchievementsHeaderWrapper from "../components/achievementsHeaderWrapper";
import AchievementsListWrapper from "../components/achievementsListWrapper";
import IgnoredAchievementsListWrapper from "../components/ignoredAchievementsListWrapper";
import { AchievementsPageContextProvider } from "../components/achievementsPageContextProvider";
import AchievementsManagerCache from "../AchievementsManagerCache";
import { RouteProps } from "react-router";

declare global {
  let navigation: { currentEntry: { url: string } };
}

class UrlMatcher {
  static get match() {
    const id = navigation.currentEntry.url.match(/app\/(\d+)\//)?.[1];

    return { params: { appid: Number(id) } };
  }
}

export default function patchAchievementsPage(cache: AchievementsManagerCache) {
  return routerHook.addPatch("/library/app/:appid/achievements", (props) => {
    // @ts-ignore
    const toReplace = routerHook.toReplace as Map<string, Function>;
    if (!toReplace) return props;

    const childrenFn = toReplace.get("/library/app/:appid/achievements");
    if (typeof childrenFn !== "function") return props;

    const childrenEl = createElement(childrenFn.bind(undefined, UrlMatcher), {});

    afterPatch(childrenEl, "type", (_, ret1?: ReactElement) => {
      if (!ret1?.type) return ret1;

      afterPatch(ret1, "type", (args, ret2?: ReactElement) => {
        const appId: number = args[0]?.appid;
        if (!appId) return ret2;

        const myAchievementsPage = ret2?.props?.children?.props?.children?.[1]?.props?.children?.props?.children?.[0];
        if (!myAchievementsPage?.props?.children?.type) return ret2;

        afterPatch(myAchievementsPage.props.children, "type", (_, ret3?: ReactElement) => {
          const headerContainer = ret3?.props?.children?.[0];
          if (!headerContainer?.props?.children) return ret3;

          const achievementsTabs = ret3?.props?.children?.[1]?.props?.children?.props?.tabs;
          if (!achievementsTabs) return ret3;

          const myAchievementsTab = achievementsTabs.find((tab: { id?: string }) => tab?.id === "achievements");
          if (!myAchievementsTab?.content?.type) return ret3;

          headerContainer.props.children = (
            <AchievementsHeaderWrapper>{headerContainer.props.children}</AchievementsHeaderWrapper>
          );

          const ignoredAchievementsTab = {
            ...myAchievementsTab,
            id: "ignored",
            title: "Ignored achievements",
            content: cloneElement(myAchievementsTab.content, {
              ...myAchievementsTab.content.props,
              appid: `i${appId}`,
            }),
          };

          achievementsTabs.push(ignoredAchievementsTab);

          afterPatch(myAchievementsTab.content, "type", (_, ret4?: ReactElement) => {
            if (!ret4?.props?.children) return ret4;

            ret4.props.children.splice(
              1,
              2,
              <AchievementsListWrapper appId={appId} cache={cache}>
                {ret4.props.children[1]}
              </AchievementsListWrapper>,
            );

            return ret4;
          });

          afterPatch(ignoredAchievementsTab.content, "type", (_, ret4?: ReactElement) => {
            if (!ret4?.props?.children) return ret4;

            ret4.props.children.splice(
              1,
              2,
              <IgnoredAchievementsListWrapper appId={appId} cache={cache}>
                {ret4.props.children[1]}
              </IgnoredAchievementsListWrapper>,
            );

            return ret4;
          });

          return <AchievementsPageContextProvider>{ret3}</AchievementsPageContextProvider>;
        });

        return ret2;
      });

      return ret1;
    });

    return { ...props, children: childrenEl } as RouteProps;
  });
}
