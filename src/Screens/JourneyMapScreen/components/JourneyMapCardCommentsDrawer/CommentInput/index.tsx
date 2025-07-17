import { FC, useEffect, useRef, useState } from 'react';

import './style.scss';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill-mention/dist/quill.mention.css';
import { Mention, MentionBlot } from 'quill-mention';

import { useGetQueryDataByKey } from '@/hooks/useQueryKey';
import { OrganizationUserType } from '@/Screens/UsersScreen/types.ts';

interface ICommentInput {
  addComment: (text: string, commentId?: number) => void;
  focus?: () => void;
  value?: string;
}

Quill.register({ 'blots/mention': MentionBlot, 'modules/mention': Mention });

const CommentInput: FC<ICommentInput> = ({ addComment, value }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [quillInstance, setQuillInstance] = useState<Quill | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');

  const allUsers = useGetQueryDataByKey('GetOrganizationUsers');

  const onHandleAddComment = () => {
    if (quillInstance) {
      // const editorContent = quillInstance.getContents(); // Get the Delta object
      // const plainText = quillInstance.getText(); // Get plain text
      const htmlContent = quillInstance.root.innerHTML; // Get HTML content
      addComment(htmlContent);
      quillInstance?.clipboard.dangerouslyPasteHTML('');
      setEditorContent('');
    }
    return null;
  };

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Type to comment',
        modules: {
          toolbar: false,
          mention: {
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            mentionDenotationChars: ['@', '#'],
            source: function (
              searchTerm: string,
              renderList: (matches: any, searchTerm: string) => void,
            ) {
              if (searchTerm.length === 0) {
                renderList(
                  allUsers.getOrganizationUsers?.users.map((user: OrganizationUserType) => {
                    return {
                      id: user.id,
                      value: user.emailAddress,
                      email: user.emailAddress,
                      firstName: user.firstName,
                      lastName: user.lastName,
                    };
                  }),
                  searchTerm,
                );
              } else {
                const matches = allUsers.getOrganizationUsers?.users.filter(
                  (user: OrganizationUserType & { value: string }) =>
                    user.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()),
                );
                renderList(matches, searchTerm);
              }
            },
          },
        },
      });

      setQuillInstance(quill);
    }
  }, [allUsers.getOrganizationUsers?.users]);

  useEffect(() => {
    if (value) {
      quillInstance?.clipboard.dangerouslyPasteHTML(value);
      quillInstance?.focus();
      quillInstance?.setSelection(quillInstance.getText().length, quillInstance.getText().length);
    }
  }, [quillInstance, value]);

  quillInstance?.on('text-change', () => {
    setEditorContent(quillInstance.getText() || '');
  });

  return (
    <div data-testid={'comment-input'} className={'comment-input'}>
      <div ref={editorRef} />

      <button
        disabled={editorContent.length < 1}
        className="absolute right-[10px] top-[5px]"
        data-testid="send-comment-test-id"
        onClick={onHandleAddComment}>
        <span
          className={'wm-send'}
          style={{
            color: editorContent.length > 1 ? '#1B87E6' : '#D8D8D8',
          }}
        />
      </button>
    </div>
  );
};

export default CommentInput;
