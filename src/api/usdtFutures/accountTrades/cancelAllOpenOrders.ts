import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CancelAllOpenOrdersResponse {
  code: number;
  msg: string;
}

interface CancelAllOpenOrdersResponseRaw {
  code: '200';
  msg: 'The operation of cancel all open order is done.';
}

export async function cancelAllOpenOrders(client: BinanceSignedClient, symbol: string) {
  const response = await apiCall<CancelAllOpenOrdersResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/allOpenOrders',
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
