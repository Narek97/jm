import { FC, useCallback, useEffect, useRef, useState } from 'react';

import './style.scss';

import Quill from 'quill';
import 'quill/dist/quill.js';
import 'quill/dist/quill.bubble.css';

import EditorModal from '../EditorModal/index.tsx';
import { getQuillConfig, setEditorValue } from '../QuilConfig';

interface IMapEditor {
  layoutId: string;
  initValue: string;
  onHandleTextChange: (html: any) => void;
  disabled?: boolean;
  color?: string;
  customClass?: string;
}

const PersonaEditor: FC<IMapEditor> = ({
  layoutId,
  initValue,
  onHandleTextChange,
  disabled = false,
  color = '#545e6b',
  customClass,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (editorRef.current) {
      const { initializeQuill } = getQuillConfig({
        editor: editorRef.current,
        onCustomButtonAction: () => {
          setIsModalOpen(prev => !prev);
        },
        onHandleTextChange,
        disabled,
        initValue,
      });

      const quill = initializeQuill(quillRef, color);
      quill.root.innerHTML = initValue || '';

      return () => {
        quill.off('text-change');
        quillRef.current?.off('text-change');
        quillRef.current = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutId]);

  const onSaveEditorValue = useCallback(
    (value: string) => {
      setEditorValue(quillRef, value);
      onHandleTextChange(value);
    },
    [onHandleTextChange],
  );

  useEffect(() => {
    if (quillRef?.current?.root) {
      quillRef.current.root.style.color = color;
    }
  }, [color, initValue]);

  return (
    <>
      {isModalOpen && (
        <EditorModal
          initValue={initValue}
          onSave={value => onSaveEditorValue(value)}
          isOpen={isModalOpen}
          handleClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      <div className={`${customClass}`} ref={editorRef} />
    </>
  );
};

export default PersonaEditor;
