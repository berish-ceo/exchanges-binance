import type { AxiosInstance, AxiosError } from 'axios';
import { numberParser, parse } from '@berish/safe-parsing';

import { BinanceClient } from '../clients';
import { BinanceError, CONST } from '../info';
import { resolveHeaders } from '../utils';

export function responseUpdateXMBXUsedWeight(binanceClient: BinanceClient): (instance: AxiosInstance) => () => void {
  return (instance) => {
    const id = instance.interceptors.response.use(
      (response) => {
        if (response && response.headers) updateXMBXUsedWeight(binanceClient, Object.entries(response.headers));

        return response;
      },
      (error: AxiosError | Error | any) => {
        if (error && error instanceof BinanceError) updateXMBXUsedWeight(binanceClient, error.headers);

        throw error;
      },
    );

    return () => {
      instance.interceptors.response.eject(id);
    };
  };
}

function updateXMBXUsedWeight(client: BinanceClient, headers: [string, string][]) {
  if (!client) throw new TypeError('updateXMBXUsedWeight client is empty');
  if (!(client instanceof BinanceClient)) throw new TypeError('updateXMBXUsedWeight client is not BinanceClient');

  headers = resolveHeaders(headers, [CONST.X_MBX_USED_WEIGHT_HEADER], 'strict');

  const weight = parse(headers[0] && headers[0][1], numberParser);

  client[CONST.SYMBOL_X_MBX_USED_WEIGHT] = weight || 0;
}
