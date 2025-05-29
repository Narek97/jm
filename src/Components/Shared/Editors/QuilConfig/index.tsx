import { MutableRefObject } from 'react';

import Quill from 'quill';
import { v4 as uuidv4 } from 'uuid';

import { EDIT_TEXT_ICON, QUILL_EDITOR_FONTS } from './constnats';

export const getQuillConfig = ({
  editor,
  onCustomButtonAction,
  onHandleTextChange,
  disabled,
  initValue,
}: {
  editor: HTMLDivElement;
  onCustomButtonAction: () => void;
  onHandleTextChange: (text: string) => void;
  disabled: boolean;
  initValue: string;
}) => {
  const uuid = uuidv4();
  const customButtonOption = `custom-button-${uuid}`;
  const toolbarOptions = [['bold', 'italic', 'underline', customButtonOption]];

  const FontAttributor: any = Quill.import('attributors/style/font');
  FontAttributor.whitelist = QUILL_EDITOR_FONTS;
  Quill.register(FontAttributor, true);

  const config = {
    theme: 'bubble',
    placeholder: 'Type here...',
    bounds: editor,
    modules: {
      toolbar: {
        container: toolbarOptions,
        handlers: {
          [customButtonOption]: () => {
            onCustomButtonAction();
          },
        },
      },
    },
  };

  const initializeQuill = (quillRef: React.MutableRefObject<Quill | null>, color?: string) => {
    const quill = new Quill(editor, config);
    quillRef.current = quill;

    const customButton = document.querySelector(`.ql-custom-button-${uuid}`);
    if (customButton) {
      customButton.setAttribute('id', uuidv4());
      customButton.innerHTML = EDIT_TEXT_ICON;
    }

    quill.on('text-change', (_delta, _oldDelta, source) => {
      if (source === 'user') {
        const content = quill.root.innerText.trim() === '' ? '' : quill.root.innerHTML;
        onHandleTextChange(content);
      }
    });

    if (disabled) {
      quill.enable(false);
    }

    if (quillRef.current && initValue !== quillRef.current.root.innerHTML) {
      // journey map card | NEED TO CHECK BEHAVIOR
      // dangerouslyPasteHTML set data of editor as 'API' not 'USER'
      quillRef.current.clipboard.dangerouslyPasteHTML(initValue || '');
      quillRef.current.setSelection(null);
      if (color) {
        quillRef.current.root.style.color = color!;
      }
    }
    return quill;
  };

  return { initializeQuill };
};

export const setEditorValue = (quillRef: MutableRefObject<Quill | null>, value: string) => {
  const quill = quillRef.current;
  if (quill) {
    const currentSelection = quill.getSelection();
    quill.clipboard.dangerouslyPasteHTML(value || '');
    if (currentSelection) {
      quill.setSelection(currentSelection.index, 0);
    } else {
      quill.setSelection(quill.getLength());
    }
  }
};
