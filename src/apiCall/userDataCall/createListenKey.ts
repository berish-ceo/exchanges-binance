import { apiCall, ApiCallHostType } from '../apiCall';
import { BinanceKeyClient } from '../../clients';

interface CreateListenKeyResponseRaw {
  listenKey: string;
}

export interface CreateListenKeyOptions {
  client: BinanceKeyClient;
  host: ApiCallHostType;
  path: string;

  data?: { [name: string]: any };
}

export async function createListenKey(options: CreateListenKeyOptions) {
  if (!options) throw new TypeError('createListenKey options is empty');
  if (typeof options !== 'object') throw new TypeError('createListenKey options is not object');

  if (!options.client) throw new TypeError('createListenKey options.client is empty');
  if (!options.host) throw new TypeError('createListenKey options.host is empty');
  if (!options.path) throw new TypeError('createListenKey options.path is empty');

  const result = await apiCall<CreateListenKeyResponseRaw>({
    host: options.host,
    path: options.path,
    securityType: 'USER_STREAM',
    method: 'POST',
    client: options.client,
    data: options.data,
  });
  return result && result.listenKey;
}
