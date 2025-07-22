import { FC } from 'react';

interface IDeleteModalTemplate {
  item: { type: string; name: string };
  text?: string;
}

const DeleteModalTemplate: FC<IDeleteModalTemplate> = ({ item, text }) => {
  return (
    <div className={'delete-modal-template'}>
      <div className={'custom-modal-content'}>
        <div className={'delete-modal-template--content'}>
          <p className={'delete-modal-template--title'}>
            {text || `Are you sure you want to delete selected  ${item.type} ?`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteModalTemplate;
