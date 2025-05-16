import { FC } from "react";

import "./style.scss";
import { WuButton } from "@npm-questionpro/wick-ui-lib";

interface ICustomModalFooterButtons {
  isLoading?: boolean;
  firstButtonName?: string;
  secondButtonName?: string;
  isDisableFirstButton?: boolean;
  isDisableSecondButton?: boolean;
  handleFirstButtonClick?: () => void;
  handleSecondButtonClick: () => void;
}

const CustomModalFooterButtons: FC<ICustomModalFooterButtons> = ({
  isLoading,
  firstButtonName = "Cancel",
  secondButtonName = "Confirm",
  isDisableFirstButton = false,
  isDisableSecondButton = false,
  handleFirstButtonClick,
  handleSecondButtonClick,
}) => {
  return (
    <div className={"modal-footer-buttons"}>
      <div className={"base-modal-footer"}>
        {handleFirstButtonClick && (
          <WuButton
            data-testid="first-btn-test-id"
            onClick={handleFirstButtonClick}
            disabled={isLoading || isDisableFirstButton}
            id={"cancel-btn-test-id"}
            variant="secondary"
          >
            {firstButtonName}
          </WuButton>
        )}

        <WuButton
          data-testid={"confirm-btn-test-id"}
          onClick={handleSecondButtonClick}
          disabled={isLoading || isDisableSecondButton}
          id={"confirm-delete-btn"}
        >
          {secondButtonName}
        </WuButton>
      </div>
    </div>
  );
};

export default CustomModalFooterButtons;
