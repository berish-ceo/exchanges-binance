import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface AutoCancelAllOpenOrdersPayload {
  symbol: string;
  countdownTime: number;
}

export interface AutoCancelAllOpenOrdersResponse {
  symbol: string;
  countdownTime: number;
}

interface AutoCancelAllOpenOrdersResponseRaw {
  symbol: string;
  countdownTime: string;
}

export async function autoCancelAllOpenOrders(client: BinanceSignedClient, payload: AutoCancelAllOpenOrdersPayload) {
  const response = await apiCall<AutoCancelAllOpenOrdersResponseRaw>({
    host: 'coinM',
    path: '/dapi/v1/countdownCancelAll',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return parse<AutoCancelAllOpenOrdersResponseRaw, AutoCancelAllOpenOrdersResponse>(
    response,
    ({ countdownTime, ...other }) => ({
      countdownTime: parse(countdownTime, numberParser),
      ...other,
    }),
  );
}
