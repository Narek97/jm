import { FC } from "react";

import CustomModal from "@/Components/Shared/CustomModal";
import CustomModalHeader from "@/Components/Shared/CustomModalHeader";

interface IPerformanceLogsQueryModal {
  isOpen: boolean;
  handleClose: () => void;
  queries: string[];
}

const PerformanceLogsQueryModal: FC<IPerformanceLogsQueryModal> = ({
  queries,
  isOpen,
  handleClose,
}) => {
  return (
    <CustomModal
      modalSize={"md"}
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
    >
      <CustomModalHeader title={"Queries"} />

      <ul className={"!p-4 !max-h-[60dvh] overflow-y-auto"}>
        {queries.map((query, index) => (
          <li className={"!mt-[10px]"} key={query}>
            {index + 1}. {query}
          </li>
        ))}
      </ul>
    </CustomModal>
  );
};

export default PerformanceLogsQueryModal;
