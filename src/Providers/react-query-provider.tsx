import React, { FC } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/Providers/constants.ts';

interface IRecoilProvider {
  children: React.ReactNode;
}

const ReactQueryProvider: FC<IRecoilProvider> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
