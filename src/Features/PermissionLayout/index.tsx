import React, { FC } from 'react';

import { WuButton } from '@npm-questionpro/wick-ui-lib';

import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { TOKEN_NAME } from '@/Constants';
import { useUserStore } from '@/Store/user.ts';
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
      <div className={'flex items-center justify-center flex-col gap-5 h-[calc(100dvh-3rem)]'}>
        <h1 className={'text-center'}>
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
