import { FC } from "react";

import "./style.scss";

import {
  WuSidebarContent,
  WuSidebarFooter,
  WuSidebarItem,
  WuSidebarMenu,
} from "@npm-questionpro/wick-ui-lib";
import { Link, useRouter } from "@tanstack/react-router";

import { MenuTabType } from "@/features/sidebar-layout/types.ts";
import { useBreadcrumbStore } from "@/store/breadcrumb.ts";
import { useUserStore } from "@/store/user.ts";

interface IHoverMenuPanel {
  topTabs: Array<MenuTabType>;
  bottomTabs?: Array<MenuTabType>;
}

const HoverMenuPanel: FC<IHoverMenuPanel> = ({ topTabs, bottomTabs }) => {
  const { user } = useUserStore();
  const { breadcrumbs, setBreadcrumbs } = useBreadcrumbStore();

  const { state } = useRouter();
  const pathname = state.location.pathname;

  return (
    <>
      <WuSidebarContent>
        <WuSidebarMenu>
          {topTabs.map((topTab) => (
            <WuSidebarItem
              key={topTab.url}
              className={`hover-menu-panel-nav-link  ${
                topTab.regexp && topTab.regexp.test(pathname) ? "active" : ""
              }`}
              Icon={
                typeof topTab.icon === "string" ? (
                  <span className={topTab.icon} />
                ) : (
                  <span className={"hover-menu-panel-nav-link-icon"}>
                    {topTab.icon}
                  </span>
                )
              }
              onClick={() =>
                setBreadcrumbs(breadcrumbs.slice(0, topTab.breadcrumbSlice))
              }
            >
              <Link data-testid={topTab.name} to={topTab.url}>
                {topTab.name}
              </Link>
            </WuSidebarItem>
          ))}
        </WuSidebarMenu>
      </WuSidebarContent>

      <WuSidebarFooter>
        <WuSidebarMenu>
          {bottomTabs?.map((bottomTab) => {
            if (!user?.isAdmin && bottomTab?.name === "Admin") {
              return null;
            }
            return (
              <WuSidebarItem
                key={bottomTab.url}
                className={`hover-menu-panel-nav-link  ${
                  bottomTab.regexp && bottomTab.regexp.test(pathname)
                    ? "active"
                    : ""
                }`}
                Icon={
                  typeof bottomTab.icon === "string" ? (
                    <span
                      onClick={() =>
                        setBreadcrumbs(
                          breadcrumbs.slice(0, bottomTab.breadcrumbSlice),
                        )
                      }
                      className={bottomTab.icon}
                    />
                  ) : (
                    <span className={"hover-menu-panel-nav-link-icon"}>
                      {bottomTab.icon}
                    </span>
                  )
                }
              >
                <Link data-testid={bottomTab.name} to={bottomTab.url}>
                  {bottomTab.name}
                </Link>
              </WuSidebarItem>
            );
          })}
        </WuSidebarMenu>
      </WuSidebarFooter>
    </>
  );
};

export default HoverMenuPanel;
