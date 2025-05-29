import { DemographicInfoTypeEnum } from "@/api/types";

export const getDemographicFiledKey = (fieldType: DemographicInfoTypeEnum) => {
  return [
    DemographicInfoTypeEnum.Image,
    DemographicInfoTypeEnum.Content,
  ].includes(fieldType)
    ? "personaFieldSections"
    : "demographicInfoFields";
};
