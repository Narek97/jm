import { FC } from "react";

import "./style.scss";

interface ICustomFileUploader2 {
  title?: string;
}

const CustomFileUploader2: FC<ICustomFileUploader2> = ({
  title = "Choose file",
}) => {
  return (
    <div
      className={"custom-file-uploader2"}
      data-testid={"custom-file-uploader2"}
    >
      <div className={"custom-file-uploader2--content"}>
        <p className={"custom-file-uploader2--title"}>Drag your file here</p>
        <div className={"custom-file-uploader2--btn"}>
          <span className={"wm-upload"} />
          <div className={"custom-file-uploader2--btn-title"}>{title}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomFileUploader2;
