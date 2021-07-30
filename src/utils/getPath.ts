import { makeQueryString } from './makeQueryString';

export interface GetPathOptions {
  path: string;
  host: string;
  data?: { [name: string]: any };
}

export function getPath(options: GetPathOptions) {
  const { host, path, data } = options;

  const queryString = typeof data === 'undefined' || data === null ? '' : makeQueryString(data);
  return [`${host}${path}`, queryString].filter(Boolean).join('?');
}
