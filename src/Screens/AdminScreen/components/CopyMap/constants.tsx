import HighlightedText from "@/Components/Shared/HightlitedText";
import { TableColumnType } from "@/types";

const ORGS_TABLE_COLUMNS = (search: string): Array<TableColumnType> => {
  return [
    {
      id: "orgId",
      label: "OrgId",
      renderFunction: ({ orgId }) => (
        <HighlightedText name={String(orgId)} search={search} />
      ),
    },
    {
      id: "name",
      label: "Name",
      renderFunction: ({ name }) => (
        <HighlightedText name={name} search={search} />
      ),
    },
  ];
};

export { ORGS_TABLE_COLUMNS };
