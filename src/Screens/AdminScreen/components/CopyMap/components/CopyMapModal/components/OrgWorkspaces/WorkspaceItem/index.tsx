import { FC } from 'react';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';

import { OrgWorkspaceType } from '../types';

interface IWorkspaceItem {
  workspace: OrgWorkspaceType;
  handleClick: (workspace: OrgWorkspaceType) => void;
}

const WorkspaceItem: FC<IWorkspaceItem> = ({ workspace, handleClick }) => {
  return (
    <li
      key={workspace?.id}
      data-testid={`workspace-item-test-id-${workspace?.id}`}
      className={`selectable-item`}
      onClick={() => handleClick(workspace)}>
      <div className="w-full ml-2 truncate max-w-[90%]">
        <WuTooltip content={workspace?.name} showArrow position={'bottom'}>
          <div
            className={`text-[#1b87e6] font-medium text-base truncate max-w-full ${
              !workspace.name?.length ? 'italic' : ''
            }`}>
            {workspace?.name || 'No name'}
          </div>
        </WuTooltip>
      </div>
    </li>
  );
};
export default WorkspaceItem;
