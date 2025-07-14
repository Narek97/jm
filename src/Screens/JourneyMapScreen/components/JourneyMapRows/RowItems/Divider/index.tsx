import React, { FC, memo } from 'react';

import './style.scss';
import CustomLoader from '@/Components/Shared/CustomLoader';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';

interface IDivider {
  row: JourneyMapRowType;
}

const Divider: FC<IDivider> = memo(({ row }) => {
  return (
    <div className={'divider'} data-testid="divider-section-test-id">
      {row.boxes?.map((boxItem: BoxType, index) => (
        <React.Fragment key={index}>
          {boxItem.isLoading ? (
            <div className={'journey-map-row--loading'}>
              <CustomLoader />
            </div>
          ) : (
            <div
              className={'divider--item'}
              data-testid={`divider-item-${index}-test-id`}
              style={{
                width: `${index === row.boxes!.length - 1 ? '17.438rem' : '17.5rem'}`,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

export default Divider;
