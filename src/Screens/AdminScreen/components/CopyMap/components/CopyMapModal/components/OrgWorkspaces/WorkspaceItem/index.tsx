import { FC } from 'react';

import './style.scss';

import { Tooltip } from '@mui/material';

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
        <Tooltip title={workspace?.name} arrow placement={'bottom'}>
          <div
            className={`workspace-list--item--content--title ${
              !workspace.name?.length ? 'no-title' : ''
            }`}>
            {workspace?.name || 'No name'}
          </div>
        </Tooltip>
      </div>
    </li>
  );
};
export default WorkspaceItem;
