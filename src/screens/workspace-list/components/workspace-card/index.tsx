import { FC } from "react";
import "./style.scss";

import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import fromNow from "dayjs/plugin/relativeTime";

import WorkspaceAnalytics from "@/components/shared/workspace-analytics";
import { WorkspaceType } from "@/screens/workspace-list/types.ts";
import { WorkspaceAnalyticsEnumType } from "@/types/enum.ts";

dayjs.extend(fromNow);

interface IWorkspaceItem {
  workspace: WorkspaceType;
}

const WorkspaceCard: FC<IWorkspaceItem> = ({ workspace }) => {
  const navigate = useNavigate();

  const onHandleNavigateToBoards = () => {
    navigate({ to: `/workspace/${workspace.id}/boards` }).then();
  };

  return (
    <>
      <li
        className={"workspace-card"}
        onClick={onHandleNavigateToBoards}
        data-testid="workspace-card-test-id"
      >
        <div className={"workspace-card--info"}>
          <p className={"workspace-card--info--title"}>{workspace.name}</p>
          <p className={"workspace-card--info--day"}>
            {dayjs(workspace.createdAt)?.format("MMMM D, YYYY")}
          </p>
          {workspace.description && (
            <div className={"workspace-card--info--description"}>
              <span className={"wm-comment"} />
              <p>{workspace.description}</p>
            </div>
          )}
        </div>
        <WorkspaceAnalytics
          showType={WorkspaceAnalyticsEnumType.BIG}
          data={{
            journeyMapCount: workspace.journeyMapCount || 0,
            personasCount: workspace.personasCount || 0,
          }}
        />
      </li>
    </>
  );
};

export default WorkspaceCard;
