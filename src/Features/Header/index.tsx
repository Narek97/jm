import { useCallback, useEffect, useState } from 'react';

import { WuAppHeader } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';

import $apiClient from '@/api/axios.ts';
import { TOKEN_NAME } from '@/constants';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';
import { useUserStore } from '@/store/user.ts';
import { deleteCookie } from '@/utils/cookieHelper.ts';

const Header = () => {
  const navigate = useNavigate();

  const { updateUser } = useUserStore();
  const { breadcrumbs } = useBreadcrumbStore();

  const [productSwitcherData, setProductSwitcherData] = useState<any>(null);

  const getProductSwitcher = useCallback(async () => {
    return await $apiClient.get(`${import.meta.env.VITE_API_URL}/auth/product-switcher`);
  }, []);

  const logout = () => {
    deleteCookie(TOKEN_NAME);
    window.location.href = 'https://www.questionpro.com/a/logout.do';
  };

  useEffect(() => {
    getProductSwitcher().then((action: any) => {
      if (action?.headerInfo?.[1]?.myAccount?.profile?.profilePicture) {
        const profilePicture = action.headerInfo[1].myAccount.profile.profilePicture;
        action.headerInfo[1].myAccount.profile.profilePicture = `https://www.questionpro.com${profilePicture}`;
      }

      setProductSwitcherData(action);
      const permissions = action.headerInfo[0] && action.headerInfo[0].productSwitcher?.categories;
      let isHavePermission = true;
      permissions?.forEach((products: any) => {
        if (products?.name === 'Customer Experience' && !products?.active) {
          isHavePermission = false;
        }
        if (products?.name === 'Customer Experience') {
          products?.product?.forEach((product: any) => {
            if (product.name === 'Journey Management' && !product.active) {
              isHavePermission = false;
            }
          });
        }
      });

      updateUser({ isHavePermission });
    });
  }, [getProductSwitcher, updateUser]);

  return (
    <>
      {productSwitcherData && (
        <WuAppHeader
          productName="Journey Management"
          user={
            productSwitcherData?.headerInfo[1]?.myAccount || {
              license: {},
              settings: [],
              profile: { initials: `` },
              usage: {},
              invoice: {},
              issueTrackerCount: 0,
            }
          }
          categories={productSwitcherData?.headerInfo[0].productSwitcher.categories || []}
          breadcrumbs={breadcrumbs.map(el => ({
            label: el.name,
            onClick: () => {
              navigate({ to: el.pathname || '/' }).then();
            },
          }))}
          onLogout={logout}
        />
      )}
    </>
  );
};

export default Header;
