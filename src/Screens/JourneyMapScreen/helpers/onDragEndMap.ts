import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';

export const onDragEndMap = (
  result: any,
  isDroppedAnotherRow: boolean,
  type: string,
  rows: any,
) => {
  if (!result.destination) return;
  const keyByType: {
    [key: string]: 'touchPoints' | 'metrics' | 'outcomes' | 'links' | 'boxElements';
  } = {
    TOUCHPOINTS: 'touchPoints',
    METRICS: 'metrics',
    OUTCOMES: 'outcomes',
    LINKS: 'links',
    BOX_ELEMENT: 'boxElements',
  };

  const key = keyByType[type] || 'boxElements';
  const { source, destination } = result;
  const rowBoxes = rows[source.rowIndex];
  let newData: BoxElementType[];
  const boxes = [...(rowBoxes?.boxes || [])];
  const sourceColumn = boxes[source.droppableId];
  const sourceItems = [...sourceColumn[key]];
  const [dragItem] = sourceItems.splice(source.index, 1);

  const initialColumnId = boxes[source.droppableId].columnId;
  const initialsSepId = boxes[source.droppableId].step?.id;
  const initialRowId = rows[destination.rowIndex]?.id;

  dragItem.columnId = boxes[destination.droppableId].step.columnId;
  dragItem.stepId = boxes[destination.droppableId].step?.id;

  if (isDroppedAnotherRow) {
    newData = Object.values({
      ...boxes,
      [source.droppableId]: {
        ...sourceColumn,
        [key]: sourceItems,
      },
    }) as BoxElementType[];
    const destinationRowBoxes = rows[destination.rowIndex];
    const destinationBoxes = [...(destinationRowBoxes?.boxes || [])];
    const destColumnForRow = destinationBoxes[destination.droppableId];
    const destItemsForRow = [...destColumnForRow[key]];
    destItemsForRow.splice(destination.index, 0, dragItem);

    dragItem.rowId = destinationRowBoxes?.id;
    dragItem.columnId = destColumnForRow?.columnId;

    rows[destination?.rowIndex].boxes = Object.values({
      ...destinationBoxes,
      [destination.droppableId]: {
        ...destColumnForRow,
        [key]: destItemsForRow,
      },
    });
  } else {
    const destColumn = boxes[destination.droppableId];
    if (source.droppableId !== destination.droppableId) {
      const destItems = [...destColumn[key]];

      destItems.splice(destination.index, 0, dragItem);
      newData = Object.values({
        ...boxes,
        [source.droppableId]: {
          ...sourceColumn,
          [key]: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          [key]: destItems,
        },
      });
    } else {
      sourceItems.splice(destination.index, 0, dragItem);
      newData = Object.values({
        ...boxes,
        [source.droppableId]: {
          ...sourceColumn,
          [key]: sourceItems,
        },
      });
    }
  }

  rows[source?.rowIndex].boxes = newData;
  return { rows, dragItem, initialColumnId, initialsSepId, initialRowId };
};
