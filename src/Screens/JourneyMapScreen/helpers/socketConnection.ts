import { io } from 'socket.io-client';

import { TOKEN_NAME } from '@/constants';
import { getCookie } from '@/utils/cookieHelper.ts';

export let socket: any;
export let socketMap: any;

export const initiateSocketConnection = (isGuest: boolean) => {
  const token = getCookie(TOKEN_NAME);
  socket = io(`${import.meta.env.VITE_API_URL}/socket.io`, {
    forceNew: true,
    reconnectionAttempts: 3,
    timeout: 20000,
    transports: ['websocket'],
    auth: {
      token: isGuest ? '' : token,
    },
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const emitToSocket = (key: string, data: unknown) => {
  socket?.emit(key, data);
};

export const unEmitToSocket = (key: string) => {
  socket?.emit(key);
};

export const initiateSocketMapConnection = () => {
  const token = getCookie(TOKEN_NAME);
  socketMap = io(`${import.meta.env.VITE_API_URL}/board`, {
    forceNew: true,
    reconnectionAttempts: 3,
    timeout: 20000,
    transports: ['websocket'],
    auth: {
      token,
    },
  });
};

export const disconnectSocketMap = () => {
  if (socketMap) socketMap.disconnect();
};

export const emitToSocketMap = (key: any, data: any) => {
  socketMap?.emit(key, data);
};

export const unEmitToSocketMap = (key: any, data: any) => {
  socketMap?.emit(key, data);
};
