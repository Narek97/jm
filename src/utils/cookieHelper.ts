// src/utils/cookieHelper.ts
import Cookies from 'js-cookie';

const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes) => {
  Cookies.set(name, value, {
    path: '/',
    ...options,
  });
};

const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

const deleteCookie = (name: string) => {
  Cookies.remove(name, { path: '/' });
};

export { setCookie, getCookie, deleteCookie };
