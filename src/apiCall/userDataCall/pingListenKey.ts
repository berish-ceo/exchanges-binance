import { apiCall, ApiCallHostType } from '../apiCall';
import { BinanceKeyClient } from '../../clients';

export interface PingListenKeyOptions {
  client: BinanceKeyClient;
  host: ApiCallHostType;
  path: string;
  listenKey: string;

  data?: { [name: string]: any };
}

export async function pingListenKey(options: PingListenKeyOptions) {
  if (!options) throw new TypeError('pingListenKey options is empty');
  if (typeof options !== 'object') throw new TypeError('pingListenKey options is not object');

  if (!options.client) throw new TypeError('pingListenKey options.client is empty');
  if (!options.host) throw new TypeError('pingListenKey options.host is empty');
  if (!options.path) throw new TypeError('pingListenKey options.path is empty');
  if (!options.listenKey) throw new TypeError('pingListenKey options.listenKey is empty');

  await apiCall({
    host: options.host,
    path: options.path,
    securityType: 'USER_STREAM',
    method: 'PUT',
    client: options.client,
    data: Object.assign({ listenKey: options.listenKey }, options.data),
  });
}
