import { useState } from "react";
import "./style.scss";

import { Switch } from "@mui/material";

import { useToggleDebugModeMutation } from "@/api/mutations/generated/toggleDebugMode.generated";
import { useUserStore } from "@/store/user.ts";

const UserDebug = () => {
  const { user, updateUser } = useUserStore();

  const [isDebugModeOn, setIsDebugModeOn] = useState<boolean>(
    user?.debugMode || false,
  );

  const { mutate: toggleDebugModeMutate } = useToggleDebugModeMutation();

  const handleToggleDebugMode = (mode: boolean) => {
    setIsDebugModeOn(mode);
    updateUser({ debugMode: mode });
    toggleDebugModeMutate({ debugMode: mode });
  };

  return (
    <div className={"user-debug-settings"}>
      <label
        className={"user-debug-settings--switcher--label"}
        htmlFor="userDebugMode"
      >
        User debug mode
      </label>
      <Switch
        id={"userDebugMode"}
        color="primary"
        disableRipple={true}
        data-testid={"create-update-metrics-switch-test-id"}
        checked={isDebugModeOn}
        onChange={(e) => handleToggleDebugMode(e?.target?.checked)}
      />
    </div>
  );
};

export default UserDebug;
