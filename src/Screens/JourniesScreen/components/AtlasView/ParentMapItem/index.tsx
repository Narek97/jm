import { FC, useState, useMemo } from 'react';

import './style.scss';
import { WuButton, WuMenu, WuMenuItem } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';
import { ControlledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from 'react-complex-tree';

import 'react-complex-tree/src/style.css';
import {
  GetParentMapChildrenQuery,
  useGetParentMapChildrenQuery,
} from '@/api/queries/generated/getParentMapChildren.generated.ts';
import { querySlateTime } from '@/constants';

interface IParentMapItem {
  boardId: number;
  map: JourneyMapCardType;
  createMap: (parentId: number) => void;
  onHandleDeleteJourney: (journeyMap: { id: number; parentId: number }) => void;
}

const ParentMapItem: FC<IParentMapItem> = ({ boardId, map, createMap, onHandleDeleteJourney }) => {
  const navigate = useNavigate();

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
    <div className={`atlas-view--maps--item ${isExpanded ? 'expanded-item' : ''}`}>
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
                  className={`${context.isExpanded ? 'wm-keyboard-arrow-up' : 'wm-keyboard-arrow-down'}
                     icon-button`}
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
                  className={`atlas-view--maps--item-content ${item.index === 'addButton' ? 'button-node' : ''} ${depth === 1 ? 'child-map' : ''}`}
                  {...context.itemContainerWithChildrenProps}>
                  <InteractiveComponent
                    data-testid={`map-item-${item?.data?.id}`}
                    className={'atlas-view--maps--item-content--interactive-component'}>
                    {item.index === 'addButton' ? (
                      <div className={'add-new-child-btn'} onClick={() => createMap(map?.id)}>
                        <span className="wm-add" />
                      </div>
                    ) : (
                      <div
                        className={'atlas-view--maps--item-content--interactive-component-content'}>
                        {item?.data?.isParent && arrow}
                        <div className={'left-section'}>
                          <div
                            onClick={() => onNavigateMap(item?.data?.id)}
                            className={'node-title'}>
                            {title}
                          </div>
                          {item?.data?.isParent && (
                            <div className={'journeys-count'}>{item?.data?.mapCount}</div>
                          )}
                          <WuMenu
                            Trigger={
                              <WuButton
                                className={'child-option wicki-button'}
                                onClick={e => e.stopPropagation()}
                                Icon={<span className={'wm-more-vert'} />}
                                variant="iconOnly"
                              />
                            }>
                            <WuMenuItem>
                              <button
                                data-testid={'delete-menu-option'}
                                onClick={() => {
                                  onHandleDeleteJourney({ id: item?.data?.id, parentId: map?.id });
                                }}>
                                Delete
                              </button>
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
