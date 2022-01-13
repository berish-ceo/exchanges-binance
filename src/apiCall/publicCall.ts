import { AxiosInstance } from 'axios';

import { getPath } from '../utils';

export interface PublicCallOptions {
  axios: AxiosInstance;
  host: string;
  path: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';

  data?: { [name: string]: any };

  headers?: HeadersInit;
}

export async function publicCall<TResponse>(options: PublicCallOptions): Promise<TResponse> {
  if (!options) throw new TypeError('publicCall options is empty');
  if (typeof options !== 'object') throw new TypeError('publicCall options is not object');

  if (!options.axios) throw new TypeError('publicCall options.axios is empty');
  if (!options.host) throw new TypeError('publicCall options.host is empty');
  if (!options.path) throw new TypeError('publicCall options.path is empty');
  if (!options.method) throw new TypeError('publicCall options.method is empty');

  const requestPath = getPath({ host: options.host, path: options.path, data: options.data });

  const response = await options.axios(requestPath, {
    method: options.method,
    headers: options.headers,
  });

  return response.data;
}
