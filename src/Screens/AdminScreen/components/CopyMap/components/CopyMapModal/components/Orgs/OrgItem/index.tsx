import { FC } from 'react';
import './style.scss';

import { Tooltip } from '@mui/material';

import { OrgType } from '../types';

import HighlightedText from '@/Components/Shared/HightlitedText';

interface IOrgItem {
  org: OrgType;
  search: string;
  handleClick: (orgId: number) => void;
}

const OrgItem: FC<IOrgItem> = ({ org, search, handleClick }) => {
  return (
    <li
      key={org.orgId}
      data-testid={`org-item-test-id-${org.orgId}`}
      className={`org-list--item`}
      onClick={() => handleClick(org.orgId)}>
      <div className="org-list--item--content">
        <Tooltip title={org.name} arrow placement={'bottom'}>
          <div className={`org-list--item--content--title ${!org.name?.length ? 'no-title' : ''}`}>
            <HighlightedText name={org.orgId + ' / ' + (org?.name || 'No name')} search={search} />
          </div>
        </Tooltip>
      </div>
    </li>
  );
};
export default OrgItem;
