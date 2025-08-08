import { FC, useState, useMemo } from 'react';

import './style.css';
import { WuButton, WuMenu, WuMenuItem } from '@npm-questionpro/wick-ui-lib';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ControlledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from 'react-complex-tree';

import 'react-complex-tree/src/style.css';
import {
  GetParentMapChildrenQuery,
  useGetParentMapChildrenQuery,
} from '@/api/queries/generated/getParentMapChildren.generated.ts';
import { querySlateTime } from '@/Constants';
import { JourneyType } from '@/Screens/JourniesScreen/types.ts';

interface IParentMapItem {
  map: JourneyType;
  createMap: (parentId: number) => void;
  onHandleDeleteJourney: (journeyMap: JourneyType) => void;
}

const ParentMapItem: FC<IParentMapItem> = ({ map, createMap, onHandleDeleteJourney }) => {
  const navigate = useNavigate();
  const { boardId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journies/',
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const initialTreeItems = useMemo(
    () =>
      ({
        root: {
          index: 'root',
          isFolder: true,
          children: ['rootItem'],
          data: { title: 'Root' },
        },
        rootItem: {
          index: 'rootItem',
          isFolder: true,
          children: [],
          data: {
            id: map.id,
            title: map.title,
            isParent: true,
            mapCount: map.childMaps?.length,
          },
        },
        addButton: {
          index: 'addButton',
          children: [],
          data: { title: '➕ Add New' },
        },
      }) as Record<TreeItemIndex, TreeItem>,
    [map.childMaps?.length, map.id, map.title],
  );

  const { data } = useGetParentMapChildrenQuery<GetParentMapChildrenQuery, Error>(
    {
      parentMapId: +map.id,
    },
    {
      staleTime: querySlateTime,
      enabled: !!map?.id && isExpanded,
    },
  );

  const treeItems = useMemo(() => {
    if (!data?.getParentMapChildren) return initialTreeItems;

    const childMaps = data.getParentMapChildren;
    const result = { ...initialTreeItems };

    result.rootItem = {
      ...result.rootItem,
      children: [...childMaps.map((_: any, index: number) => `child${index}`), 'addButton'],
    };

    childMaps.forEach((child: any, index: number) => {
      result[`child${index}`] = {
        index: `child${index}`,
        isFolder: false,
        children: [],
        data: {
          title: child.title,
          id: child.id,
        },
      };
    });

    return result;
  }, [data?.getParentMapChildren, initialTreeItems]);

  const onNavigateMap = (id: number) => {
    navigate({
      to: `/board/${boardId}/journey-map/${id}`,
    }).then();
  };

  const handleExpandItem = (item: TreeItem) => {
    if (item.index === 'rootItem') {
      setIsExpanded(true);
    }
  };

  return (
    <div className={`w-[18%] !min-h-8 relative ${isExpanded ? 'expanded-item' : ''}`}>
      <ControlledTreeEnvironment
        canDragAndDrop={false}
        canDropOnFolder={false}
        canReorderItems={false}
        onExpandItem={handleExpandItem}
        getItemTitle={item => item.data?.title || ''}
        items={treeItems}
        viewState={{
          ['tree-1']: {
            expandedItems: isExpanded ? ['root', 'rootItem'] : ['root'],
          },
        }}>
        <Tree
          renderItemArrow={({ item, context }) => {
            if (item.children?.length || item.index === 'rootItem') {
              return (
                <span
                  data-testid="tree-item-arrow"
                  onClick={() => {
                    if (item.index === 'rootItem') {
                      setIsExpanded(!isExpanded);
                    }
                    context.toggleExpandedState();
                  }}
                  className={`${context.isExpanded ? 'wm-keyboard-arrow-up' : 'wm-keyboard-arrow-right'}
                     text-[1.8rem] flex items-center justify-center min-w-[2rem] min-h-[2rem]`}
                />
              );
            }
            return (
              <span
                style={{
                  minWidth: '16px',
                  marginRight: '8px',
                  display: 'inline-block',
                }}
              />
            );
          }}
          treeId="tree-1"
          rootItem="root"
          treeLabel="Tree Example"
          renderItem={({ title, arrow, depth, item, context, children }) => {
            const InteractiveComponent = 'div';

            return (
              <>
                <li
                  data-testid={`tree-item-arrow-${item?.data?.id}`}
                  className={`bg-[var(--soft-gray)] text-[var(--text)] leading-[1.07rem] relative hover:bg-[var(--soft-gray)] ${item.index === 'addButton' ? 'button-node !p-0 !mb-4 !bg-transparent !leading-[1.1]' : ''} ${depth === 1 ? 'child-map !mt-2 !mx-[1.125rem] pl-2 cursor-pointer ' : ''}`}
                  {...context.itemContainerWithChildrenProps}>
                  <InteractiveComponent
                    data-testid={`map-item-${item?.data?.id}`}
                    className={'flex'}>
                    {item.index === 'addButton' ? (
                      <div
                        className={
                          'add-new-child-btn !flex !items-center !justify-center !rounded-[0.1rem] !text-[0.875rem] !w-full !border-[0.08rem] !border-[#1b87e6] !text-[var(--primary)] !box-content !p-[0.403rem] gap-[0.4rem] opacity-0 hover:bg-[var(--primary)] hover:!text-[var(--background)]'
                        }
                        onClick={() => createMap(map?.id)}>
                        <span className="wm-add" />
                      </div>
                    ) : (
                      <div
                        className={
                          'interactive-component-content !group flex items-center justify-between gap-[0.25rem] w-full'
                        }>
                        {item?.data?.isParent && arrow}
                        <div
                          className={`${depth === 1 ? 'w-full' : 'w-[calc(100%-3rem)]'} gap-[0.4rem] flex justify-between items-center
`}>
                          <div
                            onClick={() => onNavigateMap(item?.data?.id)}
                            className={'text-[0.75rem] truncate hover:text-[#1b87e6]'}>
                            {(title as string)?.trim() || 'Untitled'}
                          </div>

                          <WuMenu
                            Trigger={
                              <WuButton
                                className={`${depth === 1 ? 'w-6 h-6' : 'w-8 h-8'} wicki-button`}
                                onClick={e => e.stopPropagation()}
                                Icon={
                                  <>
                                    <span
                                      className={'text-[1rem] wm-more-vert journeys-menu hidden'}
                                    />
                                    {item?.data?.isParent && (
                                      <div className={'journeys-count block text-[0.75rem]'}>
                                        {item?.data?.mapCount}
                                      </div>
                                    )}
                                  </>
                                }
                                variant="iconOnly"
                              />
                            }>
                            <WuMenuItem
                              className="cursor-pointer"
                              onSelect={() => {
                                onHandleDeleteJourney({ ...item?.data, parentId: map?.id });
                              }}>
                              <button data-testid={'delete-menu-option'}>Delete</button>
                            </WuMenuItem>
                          </WuMenu>
                        </div>
                      </div>
                    )}
                  </InteractiveComponent>
                </li>
                {children}
              </>
            );
          }}
        />
      </ControlledTreeEnvironment>
    </div>
  );
};

export default ParentMapItem;
