import { createSignature, makeQueryString } from '../utils';

import { apiKeyCall, ApiKeyCallOptions } from './apiKeyCall';

export interface ApiSecretCallOptions extends ApiKeyCallOptions {
  apiSecret: string;
  getTime: () => number | Promise<number>;

  /**
   * Не оставляет отпечаток времени
   */
  noTimestamp?: boolean;

  /**
   * Не добавляет цифровую подпись
   */
  noSignature?: boolean;

  recvWindow?: number;
}

export async function apiSecretCall<Response = any>(options: ApiSecretCallOptions) {
  if (!options) throw new TypeError('apiSecretCall options is empty');
  if (typeof options !== 'object') throw new TypeError('apiSecretCall options is not object');

  if (!options.host) throw new TypeError('apiSecretCall options.host is empty');
  if (!options.path) throw new TypeError('apiSecretCall options.path is empty');
  if (!options.method) throw new TypeError('apiSecretCall options.method is empty');
  if (!options.apiKey) throw new Error('apiSecretCall options.apiKey is empty');
  if (!options.apiSecret) throw new Error('apiSecretCall options.apiSecret is empty');
  if (!options.getTime) throw new Error('apiSecretCall options.getTime is empty');

  const sendData = Object.assign({}, options.data);

  if (!options.noTimestamp) {
    const timestamp = await options.getTime();
    Object.assign(sendData, { timestamp }, options.recvWindow ? { recvWindow: options.recvWindow } : undefined);
  }

  if (!options.noSignature) {
    const queryData = makeQueryString(sendData);
    const signature = createSignature(options.apiSecret, queryData);

    Object.assign(sendData, { signature });
  }

  return apiKeyCall<Response>({
    ...options,
    data: sendData,
  });
}
