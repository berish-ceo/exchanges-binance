import { makeQueryString } from './makeQueryString';

export function getRequestHostString(host: string, path: string, data: { [key: string]: any }, include: string[]) {
  include = include || [];
  data =
    data &&
    Object.entries(data || {})
      .filter(([key]) => include.includes(key))
      .reduce((out, [key, value]) => ({ ...out, [key]: value }), {});

  const queryString = typeof data === 'undefined' || data === null ? '' : makeQueryString(data);
  return [`${host}${path}`, queryString].filter(Boolean).join('?');
}
