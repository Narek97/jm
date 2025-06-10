import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './style.scss';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useParams } from '@tanstack/react-router';

import BoardDeleteModal from './components/BoardDeleteModal';
import BoardPinnedOutcomesModal from './components/PinnedOutcomeModal';
import SortableBoards from './components/SortableBoards';
import { BoardType } from './types';

import {
  GetMyBoardsQuery,
  useGetMyBoardsQuery,
} from '@/api/infinite-queries/generated/getBoards.generated.ts';
import {
  CreateBoardMutation,
  useCreateBoardMutation,
} from '@/api/mutations/generated/createBoard.generated.ts';
import {
  UpdateBoardMutation,
  useUpdateBoardMutation,
} from '@/api/mutations/generated/updateBoard.generated';
import { CreateBoardInput } from '@/api/types.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EditableItemForm from '@/Components/Shared/EditableItemForm';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { DEFAULT_OUTCOMES_GROUP, querySlateTime } from '@/constants';
import { BOARDS_LIMIT } from '@/constants/pagination.ts';
import {
  useRemoveQueriesByKey,
  useSetAllQueryDataByKey,
  useSetQueryDataByKeyAdvanced,
} from '@/hooks/useQueryKey.ts';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';
import { useWorkspaceStore } from '@/store/workspace.ts';
import { EditableInputType } from '@/types';

const BoardsScreen = () => {
  const { workspaceId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/workspace/$workspaceId/boards/',
  });

  const { setBreadcrumbs } = useBreadcrumbStore();
  const { workspace } = useWorkspaceStore();
  const { showToast } = useWuShowToast();

  const setBoards = useSetQueryDataByKeyAdvanced();
  const setAllBoards = useSetAllQueryDataByKey('getMyBoards');
  const setRemoveBoardsQuery = useRemoveQueriesByKey();

  const hasSetBreadcrumbs = useRef(false);

  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);
  const [isOpenBoardDeleteModal, setIsOpenBoardDeleteModal] = useState<boolean>(false);
  const [isOpenAllPinnedOutcomesModal, setIsOpenAllPinnedOutcomesModal] = useState<boolean>(false);

  const {
    isLoading: isLoadingBoards,
    error: errorBoards,
    data: dataBoards,
  } = useGetMyBoardsQuery<GetMyBoardsQuery, Error>(
    {
      getMyBoardsInput: {
        workspaceId: +workspaceId,
        offset,
        limit: BOARDS_LIMIT,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const boardsData = useMemo(
    () => dataBoards?.getMyBoards.boards || [],
    [dataBoards?.getMyBoards.boards],
  );

  const boardsDataCount = useMemo(
    () => dataBoards?.getMyBoards.count || 0,
    [dataBoards?.getMyBoards.count],
  );

  const { isPending: isLoadingCreateBoard, mutateAsync: mutateCreateBoard } =
    useCreateBoardMutation<Error, CreateBoardInput>({
      onSuccess: response => {
        onHandleCreateNewBoard(response.createBoard);
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

  const { mutate: mutateUpdateBoard } = useUpdateBoardMutation<Error, UpdateBoardMutation>();

  const onHandleCreateBoard = async (value: string): Promise<boolean> => {
    try {
      await mutateCreateBoard({
        createBoardInput: {
          name: value,
          workspaceId: +workspaceId,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const updateBoardName = useCallback(
    (data: EditableInputType) => {
      mutateUpdateBoard(
        {
          updateBoardInput: {
            id: +data.id,
            name: data.value,
          },
        },
        {
          onSuccess: response => {
            setBoards(
              'getMyBoards',
              {
                input: 'getMyBoardsInput',
                key: 'offset',
                value: 0,
              },
              (oldData: any) => {
                if (oldData) {
                  return {
                    getMyBoards: {
                      ...oldData.getMyBoards,
                      boards: oldData.getMyBoards.boards.map((board: BoardType) => {
                        if (board.id === data.id) {
                          return { ...board, name: response.updateBoard.name };
                        }
                        return board;
                      }),
                    },
                  };
                }
              },
            );
          },
          onError: error => {
            showToast({
              variant: 'error',
              message: error?.message,
            });
          },
        },
      );
    },
    [mutateUpdateBoard, setBoards, showToast],
  );

  const onToggleBoardDeleteModal = useCallback((board?: BoardType) => {
    setSelectedBoardId(board?.id || null);
    setIsOpenBoardDeleteModal(prev => !prev);
  }, []);

  const onToggleAllPinnedOutcomesModal = useCallback((board?: BoardType) => {
    setSelectedBoardId(board?.id || null);
    setIsOpenAllPinnedOutcomesModal(prev => !prev);
  }, []);

  const onHandleFilterBoard = useCallback(
    (id: number) => {
      if (
        currentPage * BOARDS_LIMIT >= boardsDataCount &&
        dataBoards?.getMyBoards.boards.length === 1 &&
        currentPage !== 1
      ) {
        setOffset(prev => prev - BOARDS_LIMIT);
        setCurrentPage(prev => prev - 1);
      } else if (currentPage * BOARDS_LIMIT < boardsDataCount && boardsDataCount > BOARDS_LIMIT) {
        setRemoveBoardsQuery('getMyBoards', {
          input: 'getMyBoardsInput',
          key: 'offset',
          value: offset,
          deleteUpcoming: true,
        });
      }
      setAllBoards((oldData: any) => {
        if (oldData) {
          return {
            getMyBoards: {
              ...oldData.getMyBoards,
              count: oldData.getMyBoards.count - 1,
              interviews: oldData.getMyBoards.boards.filter((board: BoardType) => board.id !== id),
            },
          };
        }
      });
    },
    [
      boardsDataCount,
      currentPage,
      dataBoards?.getMyBoards.boards.length,
      offset,
      setAllBoards,
      setRemoveBoardsQuery,
    ],
  );

  const onHandleCreateNewBoard = (newBoard: CreateBoardMutation['createBoard']) => {
    setRemoveBoardsQuery('getMyBoards', {
      input: 'getMyBoardsInput',
      key: 'offset',
      value: 0,
    });

    setBoards(
      'getMyBoards',
      {
        input: 'getMyBoardsInput',
        key: 'offset',
        value: 0,
      },
      (oldData: any) => {
        if (oldData) {
          return {
            getMyBoards: {
              offset: 0,
              limit: BOARDS_LIMIT,
              count: oldData.getMyBoards.count + 1,
              boards: [
                {
                  ...newBoard,
                  defaultMapId: null,
                  journeyMapCount: 0,
                  personasCount: 0,
                  pinnedOutcomeGroupCount: 0,
                  maps: [],
                  outcomeGroupWithOutcomeCounts: DEFAULT_OUTCOMES_GROUP,
                  workspaceId,
                },
                ...oldData.getMyBoards.boards.slice(0, BOARDS_LIMIT - 1),
              ],
            },
          };
        }
      },
    );

    setCurrentPage(1);
    setOffset(0);
  };

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    setOffset((newPage - 1) * BOARDS_LIMIT);
  }, []);

  useEffect(() => {
    if (dataBoards && !hasSetBreadcrumbs.current) {
      setBreadcrumbs([
        {
          name: 'Workspaces',
          pathname: '/workspaces',
        },
        {
          name: dataBoards.getMyBoards.workspace.name || '...',
          pathname: `/workspace/${workspaceId}/boards`,
        },
      ]);
      hasSetBreadcrumbs.current = true;
    }
  }, [dataBoards, setBreadcrumbs, workspaceId]);

  if (errorBoards) {
    return <CustomError error={errorBoards?.message} />;
  }

  return (
    <div className={'boards'} data-testid={'boards-test-id'}>
      {isOpenBoardDeleteModal && (
        <BoardDeleteModal
          isOpen={isOpenBoardDeleteModal}
          boardID={selectedBoardId}
          handleClose={onToggleBoardDeleteModal}
          onHandleFilterBoard={onHandleFilterBoard}
        />
      )}
      {isOpenAllPinnedOutcomesModal && (
        <BoardPinnedOutcomesModal
          handleClose={onToggleAllPinnedOutcomesModal}
          isOpen={isOpenAllPinnedOutcomesModal}
          boardId={selectedBoardId}
        />
      )}
      <div className={'boards--header'}>
        <h3 className={'base-title !text-heading-2'}>{workspace?.name}</h3>
        <div className="boards--create-section">
          <EditableItemForm
            createButtonText={'New board'}
            inputPlaceholder={'Board Name'}
            value={''}
            isLoading={isLoadingCreateBoard}
            onHandleCreate={onHandleCreateBoard}
          />
          {boardsDataCount > BOARDS_LIMIT && (
            <Pagination
              perPage={BOARDS_LIMIT}
              currentPage={currentPage}
              allCount={boardsDataCount}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      </div>
      <div className={'boards--body'}>
        {isLoadingBoards && !boardsData.length ? (
          <CustomLoader />
        ) : (
          <>
            {boardsData.length ? (
              <SortableBoards
                currentPage={currentPage}
                boards={boardsData}
                updateBoardName={updateBoardName}
                onToggleBoardDeleteModal={onToggleBoardDeleteModal}
                onToggleAllPinnedOutcomesModal={onToggleAllPinnedOutcomesModal}
              />
            ) : (
              <EmptyDataInfo message={'There are no boards yet'} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BoardsScreen;
