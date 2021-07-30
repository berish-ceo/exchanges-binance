import { BinanceClient } from '../../../clients';
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

/**
 * Test connectivity to the Rest API and get the current server time.
 */
export async function checkServerTime(client: BinanceClient) {
  const response = await apiCall<CheckServerTimeResponseRaw>({
    host: 'spot',
    path: '/api/v3/time',
    method: 'GET',
    securityType: 'NONE',

    client,
  });

  return parse<CheckServerTimeResponseRaw, CheckServerTimeResponse>(response, (data) =>
    parse(data.serverTime, dateParser),
  );
}
