import { MapRowTypeEnum } from '@/api/types';
import { BoxElementType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';

export class FieldExtractor {
  private data: JourneyMapRowType[];

  constructor(data: JourneyMapRowType[]) {
    this.data = data;
  }

  extractFields(
    fields: (keyof JourneyMapRowType)[],
    boxFields: (keyof BoxElementType)[],
  ): Partial<JourneyMapRowType>[] {
    return this.data.map(item => {
      const extracted: Partial<JourneyMapRowType & any> = {};
      fields.forEach(field => {
        if (field === 'boxes' && item.boxes) {
          extracted[field] = this.extractBoxFields(item.boxes, boxFields, item.rowFunction!);
        } else {
          extracted[field] = item[field];
        }
      });
      return extracted;
    });
  }

  private extractBoxFields(
    boxes: BoxElementType[],
    boxFields: (keyof BoxElementType)[],
    type: MapRowTypeEnum,
  ): Partial<BoxElementType>[] {
    return boxes.map(box => {
      const extractedBox: Partial<BoxElementType & any> = {};
      boxFields.forEach(boxField => {
        if (Array.isArray(box[boxField])) {
          if ((box[boxField] as any[])?.length) {
            extractedBox[boxField] = this.extractNestedArrayFields(box[boxField] as any[], type);
          }
        } else {
          extractedBox[boxField] = box[boxField];
        }
      });
      return extractedBox;
    });
  }

  private extractNestedArrayFields(array: any[], type: MapRowTypeEnum): any[] {
    return array.map(item => {
      if (typeof item === 'object' && item !== null) {
        switch (type) {
          case MapRowTypeEnum.Image:
          case MapRowTypeEnum.Pros:
          case MapRowTypeEnum.Cons:
          case MapRowTypeEnum.Interactions:
          case MapRowTypeEnum.ListItem:
          case MapRowTypeEnum.Insights:
          case MapRowTypeEnum.Text: {
            return { id: item.id, text: item.text };
          }
          case MapRowTypeEnum.Touchpoints: {
            return { id: item.id, iconUrl: item.iconUrl, title: item.title };
          }
          case MapRowTypeEnum.Metrics: {
            return { id: item.id, type: item.type, name: item.name };
          }
          case MapRowTypeEnum.Outcomes: {
            return { id: item.id, status: item.status, title: item.title };
          }
          case MapRowTypeEnum.Links: {
            return { id: item.id, type: item.type, title: item.title };
          }
          default: {
            return { id: item.id };
          }
        }
      }
      return item;
    });
  }
}
