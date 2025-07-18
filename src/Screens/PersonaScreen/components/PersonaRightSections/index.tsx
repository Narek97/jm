import {
  FC,
  forwardRef,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import './style.scss';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Skeleton } from '@mui/material';
import { useWuShowToast, WuTooltip } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { Responsive, WidthProvider } from 'react-grid-layout';

import {
  DeletePersonaSectionMutation,
  useDeletePersonaSectionMutation,
} from '@/api/mutations/generated/deletePersonaSection.generated.ts';
import {
  UpdatePersonaSectionMutation,
  useUpdatePersonaSectionMutation,
} from '@/api/mutations/generated/updatePersonSections.generated';
import PersonaEditor from '@/Components/Shared/Editors/PersonaEditor';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { debounced400 } from '@/hooks/useDebounce.ts';
import { PersonSectionType } from '@/Screens/JourneyMapScreen/types.ts';
import { getIsDarkColor } from '@/utils/getIsDarkColor.ts';
import { getTextColorBasedOnBackground } from '@/utils/getTextColorBasedOnBackground.ts';

const SKELETON_COUNT = 6;
const SIZES = ['lg', 'md', 'sm'];

const ResponsiveGridLayout: any = WidthProvider(Responsive);

interface IPersonaSections {
  isLoadingPersonaSections: boolean;
  onHandleAddSection: (layout: PersonSectionType) => void;
  dataPersonaSections: Array<PersonSectionType>;
}

const PersonaRightSections: FC<
  IPersonaSections & {
    ref: RefObject<{ getNextFreePosition: () => void }>;
  }
> = memo(
  forwardRef(({ isLoadingPersonaSections, onHandleAddSection, dataPersonaSections }, ref) => {
    const queryClient = useQueryClient();

    const { showToast } = useWuShowToast();

    const [layouts, setLayouts] = useState<Array<PersonSectionType>>([]);
    const [layoutSize, setLayoutSize] = useState<string>('');
    const [isDragStart, setIsDragStart] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [initialLayouts, setInitialLayouts] = useState<Array<PersonSectionType>>([]);
    const [changeVersion, setChangeVersion] = useState<number>(0);

    console.log(dataPersonaSections, 'dataPersonaSections');

    const { mutate: mutatePersonSections } = useUpdatePersonaSectionMutation<
      Error,
      UpdatePersonaSectionMutation
    >({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['GetPersonaSections'],
        });
      },
    });

    const { mutate: mutateDeletePersonSection } = useDeletePersonaSectionMutation<
      Error,
      DeletePersonaSectionMutation
    >({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['GetPersonaSections'],
        });
        showToast({
          variant: 'success',
          message: 'A card has been deleted',
        });
      },
    });

    const onLayoutChange = (newLayout: Array<PersonSectionType>) => {
      const newDataLayout: Array<PersonSectionType> = newLayout.map((el, index = 0) => ({
        w: el.w,
        h: el.h,
        x: el.x,
        y: el.y,
        i: el.i,
        id: initialLayouts[index]?.id,
        key: initialLayouts[index]?.key,
        color: initialLayouts[index]?.color,
        isHidden: initialLayouts[index]?.isHidden,
        content: initialLayouts[index]?.content,
      }));
      if (SIZES.includes(layoutSize)) {
        setLayouts(initialLayouts);
      } else {
        setLayouts(newDataLayout);
      }
      if (isDragStart) {
        setInitialLayouts(newDataLayout);
        setIsDragStart(false);
        setLayouts(newDataLayout);
        setChangeVersion(prev => prev + 1);
        mutatePersonSections({
          updatePersonaSectionInput: {
            updatePersonaSection: newDataLayout,
          },
        });
      }
    };
    const onHandleTextChange = useCallback(
      (value: string | boolean, id: number, key: string) => {
        setLayouts(prevLayouts => {
          const newDataLayout = prevLayouts.map(el => {
            if (el.id === id) {
              return { ...el, [key]: value };
            }
            return el;
          });

          debounced400(() => {
            mutatePersonSections({
              updatePersonaSectionInput: {
                updatePersonaSection: newDataLayout,
              },
            });
          });

          setInitialLayouts(newDataLayout);
          return newDataLayout;
        });
      },
      [mutatePersonSections],
    );

    const onHandleCopyPersonaSection = useCallback(
      (layout: PersonSectionType) => {
        onHandleAddSection(layout);
      },
      [onHandleAddSection],
    );

    const onHandleDeletePersonaSection = useCallback(
      (id: number) => {
        mutateDeletePersonSection({
          id,
        });
      },
      [mutateDeletePersonSection],
    );

    useEffect(() => {
      if (!dataPersonaSections) return;

      if (dataPersonaSections.length !== layouts.length) {
        const data = dataPersonaSections.map(el => ({
          id: el.id,
          w: el.w,
          h: el.h,
          x: el.x,
          y: el.y,
          i: el.i,
          color: el.color,
          content: el.content,
          isHidden: el.isHidden,
          key: el.key,
        }));

        setLayouts(data);
        setInitialLayouts(data);
      }

      setMounted(true);
    }, [dataPersonaSections, layouts.length]);

    const getNextFreePosition = () => {
      if (layouts.length === 0) return { x: 0, y: 0 };
      const maxY = Math.max(...layouts.map(item => item.y), 0);
      const itemsAtMaxY = layouts.filter(item => item.y === maxY);
      let x = 0;
      let y = maxY;
      switch (itemsAtMaxY.length) {
        case 2:
          y += 1;
          x = 0;
          break;
        case 1:
          if (itemsAtMaxY[0].w === 2) {
            x = 0;
            y += 1;
          } else {
            x = 1;
            y = maxY;
          }
          break;
      }
      return { x, y };
    };

    useImperativeHandle(ref, () => ({
      getNextFreePosition,
    }));

    if (isLoadingPersonaSections) {
      return (
        <div className={'persona-sections--skeletons'}>
          {Array(SKELETON_COUNT)
            .fill('')
            .map((_, index) => (
              <Skeleton
                key={index}
                sx={{
                  width: `calc(50% - 0.34rem)`,
                  height: '16rem',
                }}
                animation="wave"
                variant="rectangular"
              />
            ))}
        </div>
      );
    }
    return (
      <div className={'persona-sections'}>
        <ResponsiveGridLayout
          layouts={layouts as any}
          rowHeight={128}
          autoSize
          cols={{ lg: 2, md: 2, sm: 2, xs: 1, xxs: 1 }}
          measureBeforeMount={false}
          useCSSTransforms={mounted}
          draggableCancel=".persona-item-content"
          draggableHandle=".drag-handle"
          onDragStart={() => {
            setIsDragStart(true);
          }}
          onResizeStart={() => setIsDragStart(true)}
          onBreakpointChange={(e: any) => setLayoutSize(e)}
          onLayoutChange={onLayoutChange}>
          {layouts.map((layout, index) => {
            const color = getTextColorBasedOnBackground(layout.color || '#545e6b');
            return (
              <div
                key={layout.i}
                data-testid={`persona-section-${index}`}
                data-grid={layout}
                className={`persona-sections--section ${layout.isHidden ? 'disabled-section-menu' : ''} `}
                style={{ backgroundColor: layout.color }}>
                <SectionCard
                  color={color}
                  layout={layout}
                  isDisable={false}
                  changeVersion={changeVersion}
                  onHandleCopyPersonaSection={() => onHandleCopyPersonaSection(layout)}
                  onHandleDeletePersonaSection={onHandleDeletePersonaSection}
                  onHandleTextChange={onHandleTextChange}
                />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    );
  }),
);

export default PersonaRightSections;

interface ISectionCard {
  color: string;
  layout: PersonSectionType;
  isDisable: boolean;
  onHandleTextChange: (value: string | boolean, id: number, key: string) => void;
  onHandleCopyPersonaSection: () => void;
  onHandleDeletePersonaSection: (id: number) => void;
  changeVersion: number;
}

const SectionCard: FC<ISectionCard> = memo(
  ({
    color,
    layout,
    isDisable,
    onHandleTextChange,
    onHandleCopyPersonaSection,
    onHandleDeletePersonaSection,
    changeVersion,
  }) => {
    const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    return (
      <>
        <div
          className={`persona-sections--section-menu  ${
            isOpenPopover ? 'persona-sections--open-section-menu' : ''
          }  `}
          style={{
            color,
            background: getIsDarkColor(layout.color) ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.04)',
          }}>
          {isDeleting && <WuBaseLoader />}
          <div className={'persona-sections--section-menu--left-actions'}>
            <span className={'persona-sections--section-menu--drag-drop-btn drag-handle'}>
              <span className={'wm-drag-indicator'} />
            </span>

            <PersonaEditor
              layoutId={String(changeVersion) + layout.y + '_' + layout.x}
              disabled={isDisable}
              onHandleTextChange={value => {
                onHandleTextChange(value, layout.id, 'key');
              }}
              initValue={layout.key}
              customClass={'persona-label-block'}
            />
          </div>
          <div className={'persona-sections--section-menu--right-actions'}>
            <div className={`persona-sections--section-menu--change-color-block`}>
              <label
                onClick={() => setIsOpenPopover(true)}
                htmlFor={layout.id?.toString()}
                className={`${getIsDarkColor(layout.color) ? 'dark-mode-icon' : ''} persona-sections--section-menu--change-color-btn ${
                  isOpenPopover ? '' : ''
                }`}>
                <span className={'wm-colors'} />
              </label>
              {isOpenPopover && (
                <div className={'persona-sections--section-menu--change-color-block--picker'}>
                  <input
                    id={layout.id?.toString()}
                    data-testid={'color-picker'}
                    type={'color'}
                    value={layout.color}
                    onChange={e => {
                      onHandleTextChange(e.target.value, layout.id, 'color');
                    }}
                  />
                </div>
              )}
            </div>
            <button
              disabled={isDisable}
              aria-label={'copy'}
              className={`${getIsDarkColor(layout.color) ? 'dark-mode-icon' : ''} persona-sections--section-menu--copy-btn`}
              onClick={onHandleCopyPersonaSection}>
              <span className={'wm-content-copy'} />
            </button>
            <WuTooltip
              className="wu-tooltip-content"
              content={`${layout.isHidden ? 'Show' : 'Hide'} demographic`}
              dir="ltr"
              duration={200}
              position="bottom">
              <button
                disabled={isDisable}
                aria-label={'copy'}
                className={`${getIsDarkColor(layout.color) ? 'dark-mode-icon' : ''} persona-sections--section-menu--hide-btn`}
                onClick={() => onHandleTextChange(!layout.isHidden, layout.id, 'isHidden')}>
                {layout?.isHidden ? (
                  <span className={'wm-eye-tracking'} />
                ) : (
                  <span className={'wm-eye-tracking'} />
                )}
              </button>
            </WuTooltip>

            <button
              disabled={isDisable}
              aria-label={'delete'}
              className={`${getIsDarkColor(layout.color) ? 'dark-mode-icon' : ''} persona-sections--section-menu--delete-btn`}
              onClick={() => {
                setIsDeleting(true);
                onHandleDeletePersonaSection(layout.id);
              }}>
              <span className={'wm-delete'} />
            </button>
          </div>
        </div>
        <div
          className={`persona-sections--section-input-block persona-item-content  ${getIsDarkColor(layout.color) ? 'dark-mode-editor' : ''}`}>
          <PersonaEditor
            layoutId={String(changeVersion) + layout.y + '_' + layout.x}
            disabled={isDisable}
            onHandleTextChange={value => {
              console.log(layout, 'lll');
              onHandleTextChange(value, layout.id, 'content');
            }}
            initValue={layout.content || ''}
            color={color}
            customClass={'persona-editor-block'}
          />
        </div>
      </>
    );
  },
);
