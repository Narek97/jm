import { useEffect, useLayoutEffect, useState } from 'react';

import { createFileRoute, Outlet } from '@tanstack/react-router';

import { GetMeQuery, useGetMeQuery } from '@/api/queries/generated/getMe.generated.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { LOGIN_ERROR_NAME, TOKEN_NAME } from '@/Constants';
import Header from '@/Features/Header';
import PermissionLayout from '@/Features/PermissionLayout';
import {
  disconnectSocketMap,
  initiateSocketMapConnection,
} from '@/Screens/JourneyMapScreen/helpers/socketConnection';
import { useUserStore } from '@/Store/user.ts';
import { UserType } from '@/types';
import { deleteCookie, getCookie } from '@/utils/cookieHelper.ts';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const token = getCookie(TOKEN_NAME);
    if (!token) {
      window.location.href = `${import.meta.env.VITE_AUTHORIZATION_URL}/?state=null&redirect_uri=${import.meta.env.VITE_CALLBACK_URL}&response_type=code&client_id=${import.meta.env.VITE_CLIENT_ID}`;
    }
  },
  component: Authenticated,
});

function Authenticated() {
  const { setUser } = useUserStore();

  const [loginErrorCount, setLoginErrorCount] = useState(0);

  const { data, isLoading, error } = useGetMeQuery<GetMeQuery, Error>({});

  const onHandleNavigateToQuestionpro = () => {
    localStorage.removeItem(LOGIN_ERROR_NAME);
    deleteCookie(TOKEN_NAME);

    if (window) {
      window.location.href = 'https://www.questionpro.com/a/showLogin.do';
    }
  };

  const redirectToLogin = () => {
    if (window) {
      window.location.href = `${import.meta.env.VITE_AUTHORIZATION_URL}/?state=null&redirect_uri=${import.meta.env.VITE_CALLBACK_URL}&response_type=code&client_id=${import.meta.env.VITE_CLIENT_ID}`;
    }
  };

  useEffect(() => {
    if (data) {
      localStorage.removeItem(LOGIN_ERROR_NAME);
      initiateSocketMapConnection();
      setUser({ ...data.getMe, isHavePermission: null } as UserType);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error) {
      if (loginErrorCount && +loginErrorCount === 2) {
        onHandleNavigateToQuestionpro();
      } else {
        localStorage.setItem(LOGIN_ERROR_NAME, (+loginErrorCount + 1).toString());
        deleteCookie(TOKEN_NAME);
        redirectToLogin();
      }
    }
  }, [error, loginErrorCount]);

  useLayoutEffect(() => {
    const storage = localStorage.getItem(LOGIN_ERROR_NAME);
    if (storage) {
      setLoginErrorCount(+storage);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnectSocketMap();
    };
  }, []);

  if (isLoading) {
    return <BaseWuLoader />;
  }

  return (
    <>
      <Header />
      <PermissionLayout>
        <Outlet />
      </PermissionLayout>
    </>
  );
}
