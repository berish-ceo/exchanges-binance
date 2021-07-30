import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { resolveError } from './resolveError';
import { ResolveResponseOutput } from './resolveResponse';

export interface RequestOptions {
  url: string;
  method: Method;
  headers: HeadersInit;
  httpsAgent: any;
}

export async function request<Result>(options: RequestOptions): Promise<ResolveResponseOutput<Result>> {
  const { url, method, headers, httpsAgent } = options;

  try {
    const response = await axios(url, {
      method: method,
      headers: headers,
      httpsAgent,
    });

    if (!response) throw new TypeError('resolveResponse response is empty');

    const responseHeaders: [string, string][] = Object.entries(response.headers);
    const data = response.data || ({} as Result);

    if (response.status !== 200 || ('success' in data && !data['success']))
      return { headers: responseHeaders, error: resolveError(JSON.stringify(response.data), response.status, response.statusText) };

    return { headers: responseHeaders, data };
  } catch (err: any) {
    const config = err && (err.config as AxiosRequestConfig);
    const response = err && (err.response as AxiosResponse);
    if (response) {
      const responseHeaders: [string, string][] = Object.entries(response.headers);
      const data = response.data || ({} as Result);

      return { headers: responseHeaders, error: resolveError(JSON.stringify(data), response.status, response.statusText) };
    }
    if (config) return { headers: [], error: resolveError(config.url, null, null) };

    return { headers: [], error: resolveError('Unknown response', null, null) };
  }
}
