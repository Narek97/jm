// import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
//
// import './style.scss';
// import 'quill/dist/quill.js';
// import 'quill/dist/quill.bubble.css';
//
// import Quill from 'quill';
// import { useSetRecoilState } from 'recoil';
//
// import { journeyMapState } from '@/store/atoms/journeyMap.atom';
//
// import EditorModal from '../editor-modal';
// import { getQuillConfig, setEditorValue } from '../quil-config';
//
// interface IMapEditor {
//   initValue: string;
//   onHandleTextChange: (html: any) => void;
//   itemData?: {
//     id: number;
//     rowId: number;
//     stepId: number;
//   };
//   disabled?: boolean;
//   isBackCard: boolean;
//   color?: string;
// }
//
// const MapEditor: FC<IMapEditor> = ({
//   initValue,
//   onHandleTextChange,
//   itemData,
//   disabled = false,
//   isBackCard,
//   color = '#545e6b',
// }) => {
//   const editorRef = useRef<HTMLDivElement | null>(null);
//   const quillRef = useRef<Quill | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const setJourneyMap = useSetRecoilState(journeyMapState);
//
//   useEffect(() => {
//     if (editorRef.current) {
//       const { initializeQuill } = getQuillConfig({
//         editor: editorRef.current,
//         onCustomButtonAction: () => {
//           setIsModalOpen(prev => !prev);
//         },
//         onHandleTextChange,
//         disabled,
//         initValue,
//       });
//
//       const quill = initializeQuill(quillRef, color);
//
//       return () => {
//         quill.off('text-change');
//         quillRef.current?.off('text-change');
//         quillRef.current = null;
//       };
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [color, disabled, initValue, itemData?.stepId]);
//
//   const onSaveEditorValue = useCallback(
//     (value: string) => {
//       setEditorValue(quillRef, value);
//       onHandleTextChange(value);
//       setJourneyMap(prev => {
//         const rows = prev.rows.map(r => {
//           if (r.id === itemData?.rowId) {
//             return {
//               ...r,
//               boxes: r.boxes?.map(box => {
//                 return {
//                   ...box,
//                   boxElements: box.boxElements.map(boxElement => {
//                     if (boxElement?.id === itemData.id) {
//                       if (isBackCard) {
//                         return {
//                           ...boxElement,
//                           flippedText: value,
//                         };
//                       }
//                       return {
//                         ...boxElement,
//                         text: value,
//                       };
//                     }
//                     return boxElement;
//                   }),
//                 };
//               }),
//             };
//           }
//           return r;
//         });
//         return { ...prev, rows };
//       });
//     },
//     [isBackCard, itemData?.id, itemData?.rowId, onHandleTextChange, setJourneyMap],
//   );
//
//   useEffect(() => {
//     if (quillRef?.current?.root) {
//       quillRef.current.root.style.color = color;
//     }
//   }, [color, initValue]);
//
//   return (
//     <>
//       {isModalOpen && (
//         <EditorModal
//           initValue={initValue}
//           onSave={onSaveEditorValue}
//           isOpen={isModalOpen}
//           handleClose={() => {
//             setIsModalOpen(false);
//           }}
//         />
//       )}
//       <div ref={editorRef} />
//     </>
//   );
// };
//
// export default MapEditor;
import React from 'react';

const Index = () => {
  return <div></div>;
};

export default Index;
