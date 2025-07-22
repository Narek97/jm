import React, { FC } from 'react';

import './style.scss';
import { WuButton } from '@npm-questionpro/wick-ui-lib';

import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { TOKEN_NAME } from '@/constants';
import { useUserStore } from '@/store/user.ts';
import { deleteCookie } from '@/utils/cookieHelper.ts';

interface IPermissionLayout {
  children: React.ReactNode;
}

const PermissionLayout: FC<IPermissionLayout> = ({ children }) => {
  const { user } = useUserStore();

  const logout = () => {
    deleteCookie(TOKEN_NAME);
    window.location.href = 'https://www.questionpro.com';
  };

  if (user?.isHavePermission === false) {
    return (
      <div className={'no-permission'}>
        <h1 className={'no-permission--title'}>
          You have no access to Journey management. Please contact Questionpro team for upgrade.
        </h1>
        <WuButton onClick={logout}>Go to QuestionPro</WuButton>
      </div>
    );
  }

  return (
    <>
      {user?.isHavePermission ? (
        <>{children}</>
      ) : (
        <>
          <WuBaseLoader />
        </>
      )}
    </>
  );
};

export default PermissionLayout;
