import { apiCall, ApiCallHostType } from '../apiCall';
import { BinanceKeyClient } from '../../clients';

export interface CloseListenKeyOptions {
  client: BinanceKeyClient;
  host: ApiCallHostType;
  path: string;
  listenKey: string;

  data?: { [name: string]: any };
}

export async function closeListenKey(options: CloseListenKeyOptions) {
  if (!options) throw new TypeError('closeListenKey options is empty');
  if (typeof options !== 'object') throw new TypeError('closeListenKey options is not object');

  if (!options.client) throw new TypeError('closeListenKey options.client is empty');
  if (!options.host) throw new TypeError('closeListenKey options.host is empty');
  if (!options.path) throw new TypeError('closeListenKey options.path is empty');
  if (!options.listenKey) throw new TypeError('closeListenKey options.listenKey is empty');

  await apiCall({
    host: options.host,
    path: options.path,
    securityType: 'USER_STREAM',
    method: 'DELETE',
    client: options.client,
    data: Object.assign({ listenKey: options.listenKey }, options.data),
  });
}
