import { FC, ReactNode } from "react";

import "./style.scss";

interface ICustomModalHeader {
  title: string | ReactNode;
  infoLink?: string;
}
const CustomModalHeader: FC<ICustomModalHeader> = ({ title, infoLink }) => {
  return (
    <div className={"modal-header"}>
      <div
        className={"modal-header--title"}
        data-testid="modal-header-title-test-id"
      >
        {title}
      </div>
      {infoLink && (
        <button
          data-testid="question-mark-test-id"
          className={"modal-header--question-mark"}
          onClick={() => {
            window.open(infoLink, "", "width=600,height=400");
          }}
        >
          <span className={"wm-question-mark"} />
        </button>
      )}
    </div>
  );
};

export default CustomModalHeader;
