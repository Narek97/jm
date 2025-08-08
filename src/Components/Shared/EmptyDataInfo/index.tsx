import { FC, ReactNode } from 'react';

interface IEmptyDataInfo {
  message: string | ReactNode;
  icon?: ReactNode;
  minHeight?: string;
}

const EmptyDataInfo: FC<IEmptyDataInfo> = ({ message, icon, minHeight }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full mt-5  min-h-[${minHeight || '20.625rem'}]`}
      data-testid="empty-data-test-id">
      <div className={'text-lg font-semibold mt-8'}>{message}</div>
      <div className={'mt-5!'}>{icon}</div>
    </div>
  );
};

export default EmptyDataInfo;
