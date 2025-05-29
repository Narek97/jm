import { FC, LegacyRef, useCallback, useEffect, useRef } from 'react';

import './style.scss';
import { WuButton } from '@npm-questionpro/wick-ui-lib';
import Quill from 'quill';

import CustomModal from '../../CustomModal';
import { QUILL_EDITOR_FONTS, QUILL_TOOLBAR } from '../QuilConfig/constnats.tsx';

import CustomModalHeader from '@/Components/Shared/CustomModalHeader';

interface IEditorModal {
  initValue: string;
  isOpen: boolean;
  handleClose: () => void;
  onSave: (data: string) => void;
}

const EditorModal: FC<IEditorModal> = ({ initValue, isOpen, handleClose, onSave }) => {
  const quillRef = useRef<Quill | null>(null);
  const isQuillInitialized = useRef(false);
  const editorRef = useCallback(
    (node: HTMLElement | LegacyRef<HTMLDivElement>) => {
      if (node !== null && isOpen && !isQuillInitialized.current) {
        const FontAttributor: any = Quill.import('attributors/style/font');
        FontAttributor.whitelist = QUILL_EDITOR_FONTS;
        Quill.register(FontAttributor, true);
        const quill = new Quill(node as HTMLElement, {
          theme: 'snow',
          placeholder: 'Type here...',
          bounds: node as HTMLElement,
          modules: {
            toolbar: [[{ font: FontAttributor.whitelist }], ...QUILL_TOOLBAR],
          },
        });

        quill.root.innerHTML = initValue || '';
        quillRef.current = quill;

        isQuillInitialized.current = true;
      }
    },
    [initValue, isOpen],
  );

  const handleSave = async () => {
    if (quillRef.current) {
      const content =
        quillRef.current.root.innerText?.trim() === '' ? '' : quillRef.current.root.innerHTML;
      setTimeout(() => {
        onSave(content);
        handleClose();
      }, 600);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      isQuillInitialized.current = false;
    }
  }, [isOpen]);

  return (
    <CustomModal
      isOpen={isOpen}
      modalSize={'lg'}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}>
      <CustomModalHeader title={<div className={'editor-header'}>Rich Text Editor</div>} />
      <div className={'map-item--editor'}>
        <div className={'editor-container'} ref={editorRef} />
        <div className={'base-modal-footer'}>
          <WuButton
            onClick={handleClose}
            data-testid="cancel-data-point-test-id"
            variant="secondary">
            Close
          </WuButton>
          <WuButton type={'button'} data-testid="submit-data-point-test-id" onClick={handleSave}>
            Save
          </WuButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default EditorModal;
