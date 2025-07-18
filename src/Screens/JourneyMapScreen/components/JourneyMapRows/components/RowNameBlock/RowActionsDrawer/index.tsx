import { FC, useState } from 'react';

import './style.scss';

import Drawer from '@mui/material/Drawer';

import { MapRowTypeEnum } from '@/api/types.ts';
import ConsIcon from '@/assets/public/mapRow/cons.svg';
import ConsInfoIcon from '@/assets/public/mapRow/cons_info.svg';
import DividerIcon from '@/assets/public/mapRow/divider.svg';
import DividerInfoIcon from '@/assets/public/mapRow/divider_info.svg';
import ImageIcon from '@/assets/public/mapRow/image.svg';
import ImageInfoIcon from '@/assets/public/mapRow/image_info.svg';
import InsightsIcon from '@/assets/public/mapRow/insights.svg';
import InsightInfoIcon from '@/assets/public/mapRow/insights_info.svg';
import InteractionIcon from '@/assets/public/mapRow/interaction.svg';
import InteractionInfoIcon from '@/assets/public/mapRow/interaction_info.svg';
import LinkIcon from '@/assets/public/mapRow/link.svg';
import LinksInfoIcon from '@/assets/public/mapRow/links_info.svg';
import ListIcon from '@/assets/public/mapRow/list.svg';
import ListInfoIcon from '@/assets/public/mapRow/list_info.svg';
import MediaIcon from '@/assets/public/mapRow/media.svg';
import MediaInfoIcon from '@/assets/public/mapRow/media_info.svg';
import MetricsIcon from '@/assets/public/mapRow/metrics.svg';
import MetricsInfoIcon from '@/assets/public/mapRow/metrics_info.svg';
import OutcomeInfoIcon from '@/assets/public/mapRow/outcome_info.svg';
import ProsIcon from '@/assets/public/mapRow/pros.svg';
import ProsInfoIcon from '@/assets/public/mapRow/pros_info.svg';
import SentimentIcon from '@/assets/public/mapRow/sentiment.svg';
import SentimentInfoIcon from '@/assets/public/mapRow/sentiment_info.svg';
import TextIcon from '@/assets/public/mapRow/text.svg';
import TextInfoIcon from '@/assets/public/mapRow/text_info.svg';
import TouchpointIcon from '@/assets/public/mapRow/touchpoint.svg';
import TouchpointInfoIcon from '@/assets/public/mapRow/touchpoint_info.svg';
import VideoIcon from '@/assets/public/mapRow/video.svg';
import VideoInfoIcon from '@/assets/public/mapRow/video_info.svg';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { useAddNewRow } from '@/Screens/JourneyMapScreen/hooks/useAddNewRow.tsx';
import { OutcomeGroupType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { ObjectKeysType } from '@/types';

interface IRowActionsDrawer {
  index: number;
}

const RowActionsDrawer: FC<IRowActionsDrawer> = ({ index }) => {
  const onToggleDrawer = () => {
    setIsOpen(prev => !prev);
  };

  const { mapOutcomeGroups } = useJourneyMapStore();

  const { createJourneyMapRow, isLoadingCreateRow } = useAddNewRow(onToggleDrawer);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [infoType, setInfoType] = useState<MapRowTypeEnum | null>(null);

  const analysis = [
    {
      icon: <img src={SentimentIcon} alt="Sentiment" />,
      title: 'Sentiment',
      type: MapRowTypeEnum.Sentiment,
    },
    {
      icon: <img src={TouchpointIcon} alt="Touchpoint" />,
      title: 'Touchpoints',
      type: MapRowTypeEnum.Touchpoints,
    },
    {
      icon: <img src={InteractionIcon} alt="Interaction" />,
      title: 'Interactions',
      type: MapRowTypeEnum.Interactions,
    },
    {
      icon: <img src={ProsIcon} alt="Pros" />,
      title: 'Pros',
      type: MapRowTypeEnum.Pros,
    },
    {
      icon: <img src={ConsIcon} alt="Cons" />,
      title: 'Cons',
      type: MapRowTypeEnum.Cons,
    },
    {
      icon: <img src={InsightsIcon} alt="Insights" />,
      title: 'Insights',
      type: MapRowTypeEnum.Insights,
    },
    {
      icon: <img src={MetricsIcon} alt="Metrics" />,
      title: 'Metrics',
      type: MapRowTypeEnum.Metrics,
    },
  ];
  const contentAndStructure = [
    {
      icon: <img src={DividerIcon} alt="Divider" />,
      title: 'Divider',
      type: MapRowTypeEnum.Divider,
    },
    {
      icon: <img src={TextIcon} alt="Text" />,
      title: 'Text',
      type: MapRowTypeEnum.Text,
    },
    {
      icon: <img src={ListIcon} alt="List" />,
      title: 'List item',
      type: MapRowTypeEnum.ListItem,
    },
    {
      icon: <img src={LinkIcon} alt="Link" />,
      title: 'Link lane',
      type: MapRowTypeEnum.Links,
    },
    {
      icon: <img src={ImageIcon} alt="Image" />,
      title: 'Image',
      type: MapRowTypeEnum.Image,
    },
    {
      icon: <img src={VideoIcon} alt="Video" />,
      title: 'Video',
      type: MapRowTypeEnum.Video,
    },
    {
      icon: <img src={MediaIcon} alt="Media" />,
      title: 'Media',
      type: MapRowTypeEnum.Media,
    },
  ];

  const planning = mapOutcomeGroups.map(oc => ({
    id: (oc as OutcomeGroupType)?.id,
    pluralName: (oc as OutcomeGroupType)?.pluralName,
    icon: (oc as OutcomeGroupType)?.icon,
    title: (oc as OutcomeGroupType)?.name,
    type: MapRowTypeEnum.Outcomes,
  }));

  const infoIcon: ObjectKeysType = {
    [MapRowTypeEnum.Sentiment]: <img src={SentimentInfoIcon} alt="Sentiment Info" />,
    [MapRowTypeEnum.Touchpoints]: <img src={TouchpointInfoIcon} alt="Touchpoint Info" />,
    [MapRowTypeEnum.Interactions]: <img src={InteractionInfoIcon} alt="Interaction Info" />,
    [MapRowTypeEnum.Pros]: <img src={ProsInfoIcon} alt="Pros Info" />,
    [MapRowTypeEnum.Cons]: <img src={ConsInfoIcon} alt="Cons Info" />,
    [MapRowTypeEnum.Insights]: <img src={InsightInfoIcon} alt="Insight Info" />,
    [MapRowTypeEnum.Metrics]: <img src={MetricsInfoIcon} alt="Metrics Info" />,
    [MapRowTypeEnum.Divider]: <img src={DividerInfoIcon} alt="Divider Info" />,
    [MapRowTypeEnum.Text]: <img src={TextInfoIcon} alt="Text Info" />,
    [MapRowTypeEnum.ListItem]: <img src={ListInfoIcon} alt="List Info" />,
    [MapRowTypeEnum.Links]: <img src={LinksInfoIcon} alt="Links Info" />,
    [MapRowTypeEnum.Image]: <img src={ImageInfoIcon} alt="Image Info" />,
    [MapRowTypeEnum.Video]: <img src={VideoInfoIcon} alt="Video Info" />,
    [MapRowTypeEnum.Media]: <img src={MediaInfoIcon} alt="Media Info" />,
    [MapRowTypeEnum.Outcomes]: <img src={OutcomeInfoIcon} alt="Outcome Info" />,
  };

  const onHandleCreateRow = (type: MapRowTypeEnum, additionalFields?: ObjectKeysType) => {
    setInfoType(null);
    createJourneyMapRow(index + 1, type, additionalFields);
  };

  return (
    <div
      className={`row-actions-drawer`}
      style={{
        zIndex: index === 0 ? 20 : 21,
      }}
      onMouseOver={() => {
        setInfoType(null);
      }}>
      <Drawer anchor={'left'} data-testid="drawer-test-id" open={isOpen} onClose={onToggleDrawer}>
        <div className={'row-actions-drawer--info-block'}>{infoType && infoIcon[infoType]}</div>

        {isLoadingCreateRow && (
          <div className={'row-actions-drawer--loading-block'}>
            <WuBaseLoader />
          </div>
        )}

        <div className={`row-actions-drawer--drawer`}>
          <CustomModalHeader title={`Add lane`} />
          <div className={`row-actions-drawer--drawer--content`}>
            <ul className={`row-actions-drawer--drawer--groups`}>
              <p className={`row-actions-drawer--drawer--groups-title`}>Analysis</p>
              {analysis.map(row => (
                <li
                  key={row.title}
                  className={`row-actions-drawer--drawer--groups-item`}
                  onClick={() => onHandleCreateRow(row.type)}
                  onMouseOver={e => {
                    setInfoType(row.type);
                    e.stopPropagation();
                  }}>
                  {row.icon}
                  {row.title}
                </li>
              ))}
            </ul>
            <ul className={`row-actions-drawer--drawer--groups`}>
              <p className={`row-actions-drawer--drawer--groups-title`}>Content & structure</p>

              {contentAndStructure.map(row => (
                <li
                  key={row.title}
                  className={`row-actions-drawer--drawer--groups-item`}
                  onClick={() => onHandleCreateRow(row.type)}
                  onMouseOver={e => {
                    setInfoType(row.type);
                    e.stopPropagation();
                  }}>
                  {row.icon}
                  {row.title}
                </li>
              ))}
            </ul>
            {planning.length ? (
              <ul
                className={`row-actions-drawer--drawer--groups row-actions-drawer--drawer--outcome-groups`}>
                <p className={`row-actions-drawer--drawer--groups-title`}>Planning</p>
                {planning.map(row => (
                  <li
                    key={row.id}
                    className={`row-actions-drawer--drawer--groups-item`}
                    onClick={() =>
                      onHandleCreateRow(row.type, { outcomeGroupId: row.id, label: row.pluralName })
                    }
                    onMouseOver={e => {
                      setInfoType(row.type);
                      e.stopPropagation();
                    }}>
                    <img
                      src={row.icon}
                      alt="Logo"
                      style={{
                        width: 16,
                        height: 16,
                      }}
                    />
                    {row.pluralName || row.title}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Drawer>

      <button
        data-testid={'open-actions-drawer'}
        aria-label={'Add'}
        className={`row-actions-drawer--button`}
        onClick={onToggleDrawer}>
        <span
          className={'wm-add'}
          style={{
            color: '#1B87E6',
          }}
        />
      </button>
    </div>
  );
};

export default RowActionsDrawer;
