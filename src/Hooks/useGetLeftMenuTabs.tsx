import { useMemo } from 'react';

import { SECONDARY_MENU_PANEL_TOP_TABS } from '@/Constants/tabs.tsx';
import useGetOutcomeGroups from '@/Hooks/useGetOutcomeGroups';
import { useUserStore } from '@/Store/user.ts';

const useGetLeftMenuTabs = (workspaceId: number | null) => {
  const { renderedDataOutcomes } = useGetOutcomeGroups(true);
  const { user } = useUserStore();

  const topTabs = useMemo(() => {
    if (!workspaceId) return [];
    const outcomes =
      renderedDataOutcomes?.map(itm => {
        const regexPattern = new RegExp(`^\\/workspace\\/\\d+\\/outcome\\/${String(itm?.id)}$`);
        return {
          url: `/workspace/${workspaceId}/outcome/${String(itm?.id)}`,
          regexp: regexPattern,
          ...itm,
          icon: itm.icon ? (
            <img src={itm.icon} width={100} height={100} alt={itm.pluralName || 'Outcome'} />
          ) : (
            <>AtlasIcon</>
          ),
        };
      }) || [];

    return [
      ...SECONDARY_MENU_PANEL_TOP_TABS({
        workspaceID: String(workspaceId),
        isAdmin: user?.isAdmin || false,
      }),
      ...outcomes,
    ];
  }, [renderedDataOutcomes, user?.isAdmin, workspaceId]);

  return {
    topTabs,
  };
};

export default useGetLeftMenuTabs;
