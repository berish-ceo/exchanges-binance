import { numberParser, parse } from '@berish/safe-parsing';

import { BinanceClient } from '../clients';
import { CONST } from '../info';
import { resolveHeaders } from './resolveHeaders';
import { ResolveResponseOutput } from './resolveResponse';

export function updateXMBXUsedWeight(client: BinanceClient, headers: [string, string][]) {
  if (!client) throw new TypeError('updateXMBXUsedWeight client is empty');
  if (!(client instanceof BinanceClient)) throw new TypeError('updateXMBXUsedWeight client is not BinanceClient');

  headers = resolveHeaders(headers, [CONST.X_MBX_USED_WEIGHT_HEADER], 'strict');

  const weight = parse(headers[0] && headers[0][1], numberParser);

  client[CONST.SYMBOL_X_MBX_USED_WEIGHT] = weight || 0;
}

export function updateXMBXUsedWeightAfterCall(client: BinanceClient) {
  return <T>(response: ResolveResponseOutput<T>) => {
    const error = response && response.error;
    const data = response && response.data;
    const headers = response && response.headers;

    updateXMBXUsedWeight(client, headers);

    if (error) throw error;
    return data;
  };
}
