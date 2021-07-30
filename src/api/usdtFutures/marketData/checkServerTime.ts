import { BinanceClient, BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  dateParser,
} from '@berish/safe-parsing';

export type CheckServerTimeResponse = Date;

interface CheckServerTimeResponseRaw {
  serverTime: number;
}

export async function checkServerTime(client: BinanceClient) {
  const response = await apiCall<CheckServerTimeResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/time',
    method: 'GET',
    securityType: 'NONE',

    client,
  });

  return parse<CheckServerTimeResponseRaw, CheckServerTimeResponse>(response, ({ serverTime }) =>
    parse(serverTime, dateParser),
  );
}
