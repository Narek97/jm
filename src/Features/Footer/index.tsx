import { useCallback, useState } from "react";

import "./style.scss";

import { WuFooter } from "@npm-questionpro/wick-ui-lib";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const Footer = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = !!isFetching || !!isMutating;

  const [_, setIsOpenLastQueryModal] = useState(false);

  const onHandleToggleLastQueryModal = useCallback(() => {
    setIsOpenLastQueryModal((prev) => !prev);
  }, []);

  return (
    <>
      {/*todo*/}
      {/*{isOpenLastQueryModal && (*/}
      {/*  <LastLogQueryModal*/}
      {/*    isOpen={isOpenLastQueryModal}*/}
      {/*    handleClose={onHandleToggleLastQueryModal}*/}
      {/*  />*/}
      {/*)}*/}

      <WuFooter isLoading={isLoading} loadingText="Working...">
        <div className="footer">
          <span>QuestionPro Employee Edition</span>
          <button
            className={"project-version-info"}
            data-testid="footer-version-btn-test-id"
            onClick={onHandleToggleLastQueryModal}
          >
            #Journey Management V-2.0
          </button>
        </div>
      </WuFooter>
    </>
  );
};

export default Footer;
