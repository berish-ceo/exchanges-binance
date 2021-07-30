import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CancelAllOpenOrdersResponse {
  code: number;
  msg: string;
}

interface CancelAllOpenOrdersResponseRaw {
  code: string;
  msg: string;
}

export async function cancelAllOpenOrders(client: BinanceSignedClient, symbol: string) {
  const response = await apiCall<CancelAllOpenOrdersResponseRaw>({
    host: 'usdtM',
    path: '/dapi/v1/allOpenOrders',
    method: 'DELETE',
    securityType: 'TRADE',

    client,
    data: { symbol },
  });

  return parse<CancelAllOpenOrdersResponseRaw, CancelAllOpenOrdersResponse>(response, ({ code, ...other }) => ({
    code: parse(code, numberParser),
    ...other,
  }));
}
