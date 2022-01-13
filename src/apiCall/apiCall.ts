import { BinanceClient, BinanceKeyClient, BinanceSignedClient } from '../clients';
import { CONST } from '../info';
import { resolveHeaders, updateXMBXUsedWeightAfterCall } from '../utils';
import { tryAttempts } from '../utils/tryAttempts';

import { apiKeyCall } from './apiKeyCall';
import { apiSecretCall } from './apiSecretCall';
import { publicCall } from './publicCall';
import { socketCall } from './socketCall';
import { userDataCall } from './userDataCall';

export type ApiCallHostType = 'spot' | 'usdtM' | 'coinM' | 'vanilla';

export interface ApiCallBaseOptions {
  host: ApiCallHostType;
  path: string;
}

export interface ApiCallDataOptions {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data?: { [name: string]: any };
}

export interface ApiCallClientPublicOptions {
  securityType: 'NONE';
  client: BinanceClient;
}

export interface ApiCallClientKeyOptions {
  securityType: 'USER_STREAM' | 'MARKET_DATA';
  client: BinanceKeyClient;
}

export interface ApiCallClientSignedOptions {
  securityType: 'TRADE' | 'MARGIN' | 'USER_DATA';
  client: BinanceSignedClient;

  noTimestamp?: boolean;
  noSignature?: boolean;
}

export interface ApiCallClientSocketOptions {
  securityType: 'SOCKET';
  client: BinanceClient;
}

export interface ApiCallClientUserDataOptions {
  securityType: 'USER_DATA_STREAM';
  client: BinanceKeyClient;

  data?: { [name: string]: any };
}

export type ApiCallOptions = ApiCallBaseOptions &
  ApiCallDataOptions &
  (ApiCallClientPublicOptions | ApiCallClientKeyOptions | ApiCallClientSignedOptions);
export type ApiCallCallbackOptions = ApiCallBaseOptions & (ApiCallClientSocketOptions | ApiCallClientUserDataOptions);

export function apiCall<TResponse>(options: ApiCallOptions): Promise<TResponse>;
export function apiCall<TResponse>(
  options: ApiCallCallbackOptions,
  callback: (data: TResponse, error?: any) => any,
): () => any;
export function apiCall<TResponse>(
  options: ApiCallOptions | ApiCallCallbackOptions,
  callback?: (data: TResponse, error?: any) => any,
): Promise<TResponse> | (() => any) {
  if (!options) throw new TypeError('apiCall options is empty');
  if (typeof options !== 'object') throw new TypeError('apiCall options is not object');

  if (!options.host) throw new TypeError('apiCall options.host is empty');
  if (!options.path) throw new TypeError('apiCall options.path is empty');

  if (!options.securityType) throw new TypeError('apiCall options.securityType is empty');
  if (!options.client) throw new TypeError('apiCall options.client is empty');

  if (
    options.securityType !== 'NONE' &&
    options.securityType !== 'USER_STREAM' &&
    options.securityType !== 'MARKET_DATA' &&
    options.securityType !== 'TRADE' &&
    options.securityType !== 'MARGIN' &&
    options.securityType !== 'USER_DATA' &&
    options.securityType !== 'SOCKET' &&
    options.securityType !== 'USER_DATA_STREAM'
  )
    throw new TypeError('apiCall options.type is not correct');

  if (
    (options.securityType === 'NONE' || options.securityType === 'SOCKET') &&
    !(options.client instanceof BinanceClient)
  )
    throw new TypeError('apiCall options.client is not BinanceClient');
  if (
    (options.securityType === 'USER_STREAM' ||
      options.securityType === 'USER_DATA_STREAM' ||
      options.securityType === 'MARKET_DATA') &&
    !(options.client instanceof BinanceKeyClient)
  )
    throw new TypeError('apiCall options.client is not BinanceKeyClient');
  if (
    (options.securityType === 'TRADE' || options.securityType === 'MARGIN' || options.securityType === 'USER_DATA') &&
    !(options.client instanceof BinanceSignedClient)
  )
    throw new TypeError('apiCall options.client is not BinanceSignedClient');

  // Callback вызов
  if (options.securityType === 'SOCKET' || options.securityType === 'USER_DATA_STREAM') {
    if (!callback) throw new TypeError('apiCall socket callback is empty');
    if (typeof callback !== 'function') throw new TypeError('apiCall socket callback is not correct');

    if (options.securityType === 'SOCKET') {
      return socketCall<TResponse>({ host: getHost(options.client, options.host, true), path: options.path }, callback);
    }

    if (options.securityType === 'USER_DATA_STREAM') {
      return userDataCall(
        { client: options.client, host: options.host, path: options.path, data: options.data },
        callback,
      );
    }
  }

  // Обычный вызов
  if (!options.method) throw new TypeError('apiCall options.method is empty');
  if (options.method !== 'GET' && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE')
    throw new TypeError('apiCall options.method is not correct');

  const host = getHost(options.client, options.host, false);

  if (options.securityType === 'NONE') {
    return publicCall<TResponse>({
      host,
      path: options.path,
      method: options.method,
      data: options.data,
    }).then(updateXMBXUsedWeightAfterCall(options.client));
  }

  if (options.securityType === 'USER_STREAM' || options.securityType === 'MARKET_DATA') {
    return apiKeyCall<TResponse>({
      host,
      path: options.path,
      method: options.method,
      data: options.data,
      apiKey: options.client.apiKey,
    }).then(updateXMBXUsedWeightAfterCall(options.client));
  }

  if (options.securityType === 'TRADE' || options.securityType === 'MARGIN' || options.securityType === 'USER_DATA') {
    return apiSecretCall<TResponse>({
      host,
      path: options.path,
      method: options.method,
      data: options.data,
      apiKey: options.client.apiKey,
      apiSecret: options.client.apiSecret,
      getTime: options.client.getTime,

      noTimestamp: options.noTimestamp,
      noSignature: options.noSignature,
    }).then(updateXMBXUsedWeightAfterCall(options.client));
  }

  throw new TypeError('apiCall something is wrong');
}

function getHost(client: BinanceClient, host: ApiCallHostType, isSocket: boolean): string {
  if (host === 'spot') {
    if (isSocket) return client.spotSocketEndpoint;
    return client.spotApiEndpoint;
  }

  if (host === 'usdtM') {
    if (isSocket) return client.usdFuturesSocketEndpoint;
    return client.usdFuturesApiEndpoint;
  }

  if (host === 'coinM') {
    if (isSocket) return client.coinFuturesSocketEndpoint;
    return client.coinFuturesApiEndpoint;
  }

  if (host === 'vanilla') {
    if (isSocket) return client.vanillaSocketEndpoint;
    return client.vanillaApiEndpoint;
  }

  throw new TypeError('apiCall options.host is not correct');
}
