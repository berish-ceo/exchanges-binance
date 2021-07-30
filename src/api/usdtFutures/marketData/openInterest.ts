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
export interface OpenInterestResponse {
  openInterest: number;
  symbol: string;
  time: Date;
}

interface OpenInterestResponseRaw {
  openInterest: string;
  symbol: string;
  time: number;
}

export async function openInterest(client: BinanceClient, symbol: string) {
  const response = await apiCall<OpenInterestResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/openInterest',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parse<OpenInterestResponseRaw, OpenInterestResponse>(response, ({ openInterest, time, ...other }) => ({
    openInterest: parse(openInterest, numberParser),
    time: parse(time, dateParser),
    ...other,
  }));
}
