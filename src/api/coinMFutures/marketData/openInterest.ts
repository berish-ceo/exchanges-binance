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
import { coinM } from '../../../info';
export interface OpenInterestResponse {
  symbol: string;
  pair: string;
  openInterest: number;
  contractType: coinM.ContractType;
  time: Date;
}

interface OpenInterestResponseRaw {
  symbol: string;
  pair: string;
  openInterest: string;
  contractType: coinM.ContractType;
  time: number;
}

export async function openInterest(client: BinanceClient, symbol: string) {
  const response = await apiCall<OpenInterestResponseRaw>({
    host: 'usdtM',
    path: '/dapi/v1/openInterest',
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
