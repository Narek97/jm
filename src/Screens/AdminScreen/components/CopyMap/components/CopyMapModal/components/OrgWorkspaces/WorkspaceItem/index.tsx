import { FC } from 'react';

import './style.scss';

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
      className={`workspace-list--item`}
      onClick={() => handleClick(workspace)}>
      <div className="workspace-list--item--content">
        <WuTooltip content={workspace?.name} showArrow position={'bottom'}>
          <div
            className={`workspace-list--item--content--title ${
              !workspace.name?.length ? 'no-title' : ''
            }`}>
            {workspace?.name || 'No name'}
          </div>
        </WuTooltip>
      </div>
    </li>
  );
};
export default WorkspaceItem;
