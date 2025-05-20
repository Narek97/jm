import { ReactNode } from "react";

export type GetPageContentParamsType = {
  content: any;
  defaultPage: ReactNode;
  key: string | null;
};

export const getPageContentByKey = ({
  content,
  defaultPage,
  key,
}: GetPageContentParamsType) => {
  return key && content[key] ? content[key] : defaultPage;
};
