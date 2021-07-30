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

export interface BLVTInfoStreamsResponse {
  eventTime: Date;
  symbol: string;
  tokenIssued: number;
  baskets: { futuresSymbol: string; position: number }[];
  BLVTNav: number;
  realLeverage: number;
  targetLeverage: number;
  fundingRatio: number;
}

interface BLVTInfoStreamsResponseRaw {
  e: string;
  E: number;
  s: string;
  m: number;
  b: {
    s: string;
    n: number;
  }[];
  n: number;
  l: number;
  t: number;
  f: number;
}

export function BLVTInfoStreams(
  client: BinanceClient,
  tokenName: string,
  callback: (data: BLVTInfoStreamsResponse, error?: any) => any,
) {
  if (!tokenName) throw new TypeError('BLVTInfoStreams tokenName is empty');
  if (typeof tokenName !== 'string') throw new TypeError('BLVTInfoStreams tokenName is not string');

  const parseCallback =
    callback &&
    ((data: BLVTInfoStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<BLVTInfoStreamsResponseRaw, BLVTInfoStreamsResponse>(
        data,
        ({ e, E, s, m, b, n, l, t, f, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          tokenIssued: m,
          baskets: parseArray(b, ({ s, n, ...other }) => ({
            futuresSymbol: s,
            position: n,
            ...other,
          })),
          BLVTNav: n,
          realLeverage: l,
          targetLeverage: t,
          fundingRatio: f,
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'usdtM', path: `${tokenName.toUpperCase()}@tokenNav`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
