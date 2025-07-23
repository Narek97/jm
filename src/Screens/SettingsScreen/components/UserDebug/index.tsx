import { useState } from 'react';
import './style.scss';

import { WuToggle } from '@npm-questionpro/wick-ui-lib';

import { useToggleDebugModeMutation } from '@/api/mutations/generated/toggleDebugMode.generated';
import { useUserStore } from '@/Store/user.ts';

const UserDebug = () => {
  const { user, updateUser } = useUserStore();

  const [isDebugModeOn, setIsDebugModeOn] = useState<boolean>(user?.debugMode || false);

  const { mutate: toggleDebugModeMutate } = useToggleDebugModeMutation();

  const handleToggleDebugMode = (mode: boolean) => {
    setIsDebugModeOn(mode);
    updateUser({ debugMode: mode });
    toggleDebugModeMutate({ debugMode: mode });
  };

  return (
    <div className={'user-debug-settings'}>
      <label className={'user-debug-settings--switcher--label'} htmlFor="userDebugMode">
        User debug mode
      </label>
      <WuToggle
        id={'userDebugMode'}
        checked={isDebugModeOn}
        onChange={handleToggleDebugMode}
        data-testid={'create-update-metrics-switch-test-id'}
      />
    </div>
  );
};

export default UserDebug;
