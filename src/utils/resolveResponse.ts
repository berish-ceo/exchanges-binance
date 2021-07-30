import { AxiosResponse } from 'axios';
import { BinanceError } from '../info';
import { resolveError } from './resolveError';

export interface ResolveResponseOutput<Result> {
  headers: [string, string][];
  data?: Result;
  error?: BinanceError;
}

/**
 * Finalize API response
 */
export async function resolveResponse<Result>(responsePromise: Promise<AxiosResponse<Result>>): Promise<ResolveResponseOutput<Result>> {
  if (!responsePromise) throw new TypeError('resolveResponse responsePromise is empty');

  try {
    const response = await responsePromise;
    if (!response) throw new TypeError('resolveResponse response is empty');

    const headers: [string, string][] = Object.entries(response.headers);
    const data = response.data || ({} as Result);

    if (response.status !== 200) {
      return { headers, error: resolveError(JSON.stringify(response.data), response.status, response.statusText) };
    }

    if ('success' in data && !data['success']) throw new Error(`${response.config.url} success: false`);

    return { headers, data };
  } catch (err: any) {
    if (err.response) {
      const headers: [string, string][] = Object.entries(err.response.headers);
      const status = err.response.status;
      const statusText = err.response.statusText;
      const data = err.response.data;

      return { headers, error: resolveError(JSON.stringify(data), status, statusText) };
    }
    throw new Error('unknown response from server');
  }
}
