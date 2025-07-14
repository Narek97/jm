import { FC } from 'react';

import './style.scss';
import DraggableCards from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowTextFields/DraggableCards';
import NoneDraggableCards from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowTextFields/NoneDraggableCards';
import {
  JourneyMapDraggableTextFields,
  JourneyMapRowType,
  JourneyMapTextAreaRowsType,
} from '@/Screens/JourneyMapScreen/types.ts';
import { getPageContentByKey } from '@/utils/getPageContentByKey.ts';

interface IRowTextFields {
  type: JourneyMapDraggableTextFields | JourneyMapTextAreaRowsType;
  row: JourneyMapRowType;
  width: number;
  rowIndex: number;
  headerColor: string;
  bodyColor: string;
  disabled: boolean;
  isDraggable: boolean;
}

const RowTextFields: FC<IRowTextFields> = ({
  width,
  row,
  type,
  rowIndex,
  headerColor,
  bodyColor,
  disabled,
  isDraggable,
}) => {
  return (
    <div data-testid={`row-text-field-${row.id}-test-id`} className={'row-text-fields'}>
      {getPageContentByKey({
        content: {
          'none-draggable': (
            <NoneDraggableCards
              row={row}
              type={type as JourneyMapTextAreaRowsType}
              width={width}
              headerColor={headerColor}
              bodyColor={bodyColor}
              disabled={disabled}
            />
          ),
          draggable: (
            <DraggableCards
              row={row}
              rowIndex={rowIndex}
              type={type as JourneyMapDraggableTextFields}
              width={width}
              headerColor={headerColor}
              bodyColor={bodyColor}
              disabled={disabled}
            />
          ),
        },
        key: isDraggable ? 'draggable' : 'none-draggable',
        defaultPage: <div />,
      })}
    </div>
  );
};

export default RowTextFields;
