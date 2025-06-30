import './style.scss';

import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import parse from 'html-react-parser';

import {
  ActionTypeEnum,
  LoggerTypeEnum,
  MapRowTypeEnum,
  PersonaStateEnum,
  SubActionTypeEnum,
} from '@/api/types';
import { MapLogsType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { ObjectKeysType } from '@/types';

dayjs.extend(fromNow);

const HistoryCard = ({ history }: { history: MapLogsType }) => {
  const row: ObjectKeysType = {
    [MapRowTypeEnum.Cons]: 'cons',
    [MapRowTypeEnum.Pros]: 'pros',
    [MapRowTypeEnum.Divider]: 'divider',
    [MapRowTypeEnum.Image]: 'image',
    [MapRowTypeEnum.Insights]: 'insights',
    [MapRowTypeEnum.Interactions]: 'interaction',
    [MapRowTypeEnum.Links]: 'link',
    [MapRowTypeEnum.ListItem]: 'list item',
    [MapRowTypeEnum.Media]: 'media',
    [MapRowTypeEnum.Metrics]: 'metrics',
    [MapRowTypeEnum.Outcomes]: 'outcomes',
    [MapRowTypeEnum.Sentiment]: 'sentiment',
    [MapRowTypeEnum.Steps]: 'steps',
    [MapRowTypeEnum.Text]: 'text',
    [MapRowTypeEnum.Touchpoints]: 'touchpoints',
    [MapRowTypeEnum.Video]: 'video',
    [MapRowTypeEnum.Tags]: 'tag',
  };

  const state: ObjectKeysType = {
    [PersonaStateEnum.VeryHappy]: 'happy',
    [PersonaStateEnum.Neutral]: 'neutral',
    [PersonaStateEnum.VerySad]: 'sad',
  };

  const historyContent = () => {
    switch (history.action) {
      case ActionTypeEnum.Create: {
        switch (history.model) {
          case LoggerTypeEnum.Map: {
            return `Created map "${history.to?.title}".`;
          }
          case LoggerTypeEnum.MapColumn: {
            return `Added column "${history.to?.label}". `;
          }
          case LoggerTypeEnum.ColumnStep: {
            return `Added step "${history.to?.name}" in "${history.to?.columName}" column.`;
          }
          case LoggerTypeEnum.MapRow: {
            return `Added "${row[history.to?.rowFunction]}" lane.`;
          }
          case LoggerTypeEnum.BoxElement: {
            return `Created "${row[history.to?.type]}" in ${history.to?.rowName} lane.`;
          }
          case LoggerTypeEnum.Outcome: {
            return `Added "${history.to?.name}" outcome.`;
          }
          case LoggerTypeEnum.Touchpoint: {
            return `Added  ${history.to?.touchPoints?.map(touchPoint => ` "${touchPoint.title}"`)} touchpoint in ${history.to?.rowFunction} lane.`;
          }
          case LoggerTypeEnum.Metrics: {
            return `Added "${history.to?.name}" in ${row[history.to?.rowFunction]} lane.`;
          }
          case LoggerTypeEnum.Link: {
            return `Added ${history.subAction === SubActionTypeEnum.Journey ? 'journey link' : 'external link'} "${history.to?.text}" in ${row[history.to?.rowFunction]} lane.`;
          }
          case LoggerTypeEnum.Comment:
          case LoggerTypeEnum.Note: {
            return <>added comment in "{parse(history.from?.itemName)}".</>;
          }
          case LoggerTypeEnum.Persona: {
            const connectPersonasLength = history.from?.connectPersonas.length;
            const disconnectPersonasLength = history.from?.disconnectPersonas.length;

            return `${
              connectPersonasLength
                ? `added  ${history.from?.connectPersonas.map((persona: string) => ` "${persona}"`)} ${connectPersonasLength > 1 ? 'personas.' : 'persona.'}`
                : ''
            }  ${
              disconnectPersonasLength
                ? `removed  ${history.from?.disconnectPersonas.map((persona: string) => ` "${persona}"`)} ${disconnectPersonasLength > 1 ? 'personas.' : 'persona.'}`
                : ''
            } `;
          }
          case LoggerTypeEnum.Media: {
            return `uploaded "${row[history.to?.type]}" file in ${history.to?.rowName} lane.`;
          }
          case LoggerTypeEnum.Tag: {
            return `Created "${history.to.title}" tag in the board of id: ${history.to.boardId}`;
          }
        }
        break;
      }

      case ActionTypeEnum.Update: {
        switch (history.model) {
          case LoggerTypeEnum.Map: {
            return `${history.to?.title ? `Updated map title from "${history.from?.title}" to "${history.to?.title}".` : 'erased title.'}  `;
          }
          case LoggerTypeEnum.MapColumn: {
            switch (history.subAction) {
              case SubActionTypeEnum.Title: {
                return `Renamed column  from "${history.from?.label}" to "${history.to?.label}".`;
              }
              case SubActionTypeEnum.BgColor: {
                return (
                  <>
                    Updated map column "{history.from?.columnLabel}" background color from
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.from?.bgColor || '#f5f7ff',
                      }}
                    />
                    to
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.to?.bgColor || '#f5f7ff',
                      }}
                    />
                    .
                  </>
                );
              }
            }
            break;
          }
          case LoggerTypeEnum.ColumnStep: {
            switch (history.subAction) {
              case SubActionTypeEnum.Title: {
                return `Renamed step from "${history.from?.label}" to "${history.to?.label}" in column "${history.from.columName}".`;
              }
              case SubActionTypeEnum.BgColor: {
                return (
                  <>
                    Updated step "{history.from?.stepName}" background color from
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.from?.bgColor || '#f5f7ff',
                      }}
                    />
                    to
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.to?.bgColor || '#f5f7ff',
                      }}
                    />
                    in column "{history.from.columName}".
                  </>
                );
              }
            }
            break;
          }
          case LoggerTypeEnum.MapRow: {
            switch (history.subAction) {
              case SubActionTypeEnum.Title: {
                return `Renamed column from "${history.from?.label}" to "${history.to?.label}". `;
              }
              case SubActionTypeEnum.Lock: {
                return `${history.from?.isLocked ? `Locked ${history.from?.rowLabel} lane` : `Unlocked ${history.from?.rowLabel} lane`}.`;
              }
              case SubActionTypeEnum.Collapse: {
                return `${history.from?.isCollapsed ? `Collapsed ${history.from?.rowLabel} lane.` : `Expand ${history.from?.rowLabel} lane.`}`;
              }
            }
            break;
          }
          case LoggerTypeEnum.BoxElement: {
            switch (history.subAction) {
              case SubActionTypeEnum.Title: {
                return (
                  <>
                    Updated "{row[history.from?.rowFunction]}" from "
                    {history.from.text ? parse(history.from?.text) : 'Untitled'}" to "
                    {history.to.text ? parse(history.to?.text) : 'Untitled'}".
                  </>
                );
              }
              case SubActionTypeEnum.BgColor: {
                return (
                  <>
                    Updated {row[history.from?.rowFunction]} "
                    {history.from?.text ? parse(history.from.text) : 'Untitled'}
                    " background color from
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.from?.bgColor || '#f5f7ff',
                      }}
                    />
                    to
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.to?.bgColor || '#f5f7ff',
                      }}
                    />
                    .
                  </>
                );
              }
            }
            break;
          }
          case LoggerTypeEnum.Touchpoint: {
            switch (history.subAction) {
              case SubActionTypeEnum.Title: {
                return `Updated touchpoint from ${history.from?.label} to ${history.to?.label}. `;
              }
              case SubActionTypeEnum.BgColor: {
                return (
                  <>
                    Updated touchpoint "{history.from?.title}" background color from
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.from?.bgColor || '#f5f7ff',
                      }}
                    />
                    to
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.to?.bgColor || '#f5f7ff',
                      }}
                    />
                    .
                  </>
                );
              }
            }
            break;
          }
          case LoggerTypeEnum.Metrics: {
            return `Updated ${history.to.name ? parse(history.to?.name) : 'Untitled'}" metrics.`;
          }
          case LoggerTypeEnum.Outcome: {
            return `Updated "${history.to?.name}" outcome.`;
          }
          case LoggerTypeEnum.Link: {
            switch (history.subAction) {
              case SubActionTypeEnum.BgColor: {
                return (
                  <>
                    Updated touchpoint "{history.from?.title}" background color from
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.from?.bgColor || '#f5f7ff',
                      }}
                    />
                    to
                    <span
                      className={'history-card--color-block'}
                      style={{
                        backgroundColor: history.to?.bgColor || '#f5f7ff',
                      }}
                    />
                    .
                  </>
                );
              }
              case SubActionTypeEnum.External:
              case SubActionTypeEnum.Journey: {
                return `Updated ${history.subAction === SubActionTypeEnum.Journey ? 'journey link' : 'external link'} from "${history.from?.text}" to "${history.to?.text}".`;
              }
            }
            break;
          }
          case LoggerTypeEnum.Note: {
            return <>updated note in "{parse(history.from?.itemName)}".</>;
          }
          case LoggerTypeEnum.FLiPpText: {
            return <>updated inner text in "{parse(history.from?.itemName)}".</>;
          }
          case LoggerTypeEnum.Sentiment: {
            return `changed "${history.from?.personaName}" sentiment from "${state[history.from?.oldsState]}" to "${state[history.from?.newState]}".`;
          }
          case LoggerTypeEnum.Media: {
            return `updated "${row[history.from?.rowFunction]}" file in ${history.from?.rowName} lane.`;
          }
          case LoggerTypeEnum.Tag: {
            switch (history.subAction) {
              case SubActionTypeEnum.Attach: {
                return `Attached "${history.to.title}" tag in the card of id: ${history.to.cardId}`;
              }
              case SubActionTypeEnum.Unattach: {
                return `Unttached "${history.to.title}" tag in the card of id: ${history.to.cardId}`;
              }
            }
            break;
          }
        }
        break;
      }

      case ActionTypeEnum.Delete: {
        switch (history.model) {
          case LoggerTypeEnum.MapRow: {
            return `Deleted "${history.from?.label}" lane.`;
          }
          case LoggerTypeEnum.MapColumn: {
            return `Deleted "${history.from?.label}" column.`;
          }
          case LoggerTypeEnum.ColumnStep: {
            return `Deleted "${history.from?.name}" step in "${history.from?.columName}" column.`;
          }
          case LoggerTypeEnum.Touchpoint: {
            return `Deleted "${history.from?.title}" touchpoint in ${history.from?.rowName} lane.`;
          }
          case LoggerTypeEnum.Outcome: {
            return `Deleted "${history.from?.name}" outcome in ${history.from?.rowName} lane.`;
          }
          case LoggerTypeEnum.Media: {
            return `Deleted  "${row[history.from?.rowFunction]}" in ${history.from?.rowName} lane.`;
          }
          case LoggerTypeEnum.BoxElement:
          case LoggerTypeEnum.Metrics: {
            return (
              <>
                Deleted "{history.from?.text ? parse(history.from.text) : 'Untitled'}"{' '}
                {row[history.from?.rowFunction]} in {history.from?.rowName} lane.
              </>
            );
          }
          case LoggerTypeEnum.Link: {
            return `Deleted "${history.from?.title}" link in ${history.from?.rowName} lane.`;
          }
          case LoggerTypeEnum.Tag: {
            return `Deleted "${history.to.title}" tag`;
          }
        }
        break;
      }

      case ActionTypeEnum.Merge: {
        switch (history.model) {
          case LoggerTypeEnum.MapRow: {
            return `Merged step "${history.from?.stepOne}" & step "${history.from?.stepTwo}" cells in "${history.from?.rowName}" lane. `;
          }
        }
        break;
      }

      case ActionTypeEnum.Unmerge: {
        switch (history.model) {
          case LoggerTypeEnum.MapRow: {
            return `Unmerged step "${history.from?.stepOne}" from step "${history.from?.stepTwo}" cells in "${history.from?.rowName}" lane. `;
          }
        }
        break;
      }
    }
  };

  return (
    <li className={'history-card'}>
      <div className={'history-card--user-info'}>
        <div
          className={'history-card--avatar'}
          style={{
            backgroundColor: history.member.color,
          }}>
          {history.member.firstName?.at(0)}
          {history.member.lastName?.at(0)}
        </div>
        <p>
          {history?.member?.firstName && history?.member?.lastName
            ? `${history.member.firstName} ${history.member.lastName}`
            : history?.member?.emailAddress}
        </p>
        <span>{dayjs(history.createdAt).format('DD-MM-YYYY HH:mm A')}</span>
      </div>
      <div className={'history-card--history-steps'}>{historyContent()}</div>
    </li>
  );
};

export default HistoryCard;
