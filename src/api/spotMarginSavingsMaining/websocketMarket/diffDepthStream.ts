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

export interface DiffDepthStreamResponse {
  eventTime: Date;
  symbol: string;
  firstUpdateId: number;
  finalUpdateId: number;
  bids: { price: number; quantity: number }[];
  asks: { price: number; quantity: number }[];
}

interface DiffDepthStreamResponseRaw {
  e: string;
  E: number;
  s: string;
  U: number;
  u: number;
  b: [string, string][];
  a: [string, string][];
}

export function diffDepthStream(
  client: BinanceClient,
  symbol: string,
  updateSpeed: '100ms' | '1000ms',
  callback: (data: DiffDepthStreamResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('diffDepthStream symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('diffDepthStream symbol is not string');

  if (!updateSpeed) throw new TypeError('diffDepthStream updateSpeed is empty');
  if (updateSpeed !== '100ms' && updateSpeed !== '1000ms')
    throw new TypeError('diffDepthStream updateSpeed is not 100ms or 1000ms');

  const parseCallback =
    callback &&
    ((data: DiffDepthStreamResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<DiffDepthStreamResponseRaw, DiffDepthStreamResponse>(
        data,
        ({ e, E, s, U, u, b, a, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          firstUpdateId: U,
          finalUpdateId: u,
          bids: parseArray(b, ([price, quantity]) => ({
            price: parse(price, numberParser),
            quantity: parse(quantity, numberParser),
          })),
          asks: parseArray(a, ([price, quantity]) => ({
            price: parse(price, numberParser),
            quantity: parse(quantity, numberParser),
          })),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'spot', path: `${symbol.toLowerCase()}@depth@${updateSpeed}`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
