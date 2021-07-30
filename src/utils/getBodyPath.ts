import { makeQueryString } from './makeQueryString';

export interface GetPathOptions {
  path: string;
  host: string;
  data?: { [name: string]: any };
}

export function getBodyPath(data?: { [name: string]: any }) {
  return typeof data === 'undefined' || data === null ? '' : makeQueryString(data);
}
