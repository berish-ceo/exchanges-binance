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

export interface PartialBookDepthStreamsResponse {
  eventTime: Date;
  transactionTime: Date;
  symbol: string;
  firstUpdateIdInEvent: number;
  finalUpdateIdInEvent: number;
  finalUpdateIdInLastStream: number;
  bids: { price: number; quantity: number }[];
  asks: { price: number; quantity: number }[];
}

interface PartialBookDepthStreamsResponseRaw {
  e: string;
  E: number;
  T: number;
  s: string;
  U: number;
  u: number;
  pu: number;
  b: [string, string][];
  a: [string, string][];
}

export function partialBookDepthStreams(
  client: BinanceClient,
  symbol: string,
  level: 5 | 10 | 20,
  updateSpeed: '100ms' | '250ms' | '500ms',
  callback: (data: PartialBookDepthStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('partialBookDepthStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('partialBookDepthStreams symbol is not string');

  if (!level) throw new TypeError('partialBookDepthStreams level is empty');
  if (level !== 5 && level !== 10 && level !== 20)
    throw new TypeError('partialBookDepthStreams level is not 5, 10 or 20');

  if (!updateSpeed) throw new TypeError('partialBookDepthStreams updateSpeed is empty');
  if (updateSpeed !== '100ms' && updateSpeed !== '250ms' && updateSpeed !== '500ms')
    throw new TypeError('partialBookDepthStreams updateSpeed is not 100ms, 250ms or 500ms');

  const parseCallback =
    callback &&
    ((data: PartialBookDepthStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<PartialBookDepthStreamsResponseRaw, PartialBookDepthStreamsResponse>(
        data,
        ({ e, E, T, s, U, u, pu, b, a, ...other }) => ({
          eventTime: parse(E, dateParser),
          transactionTime: parse(T, dateParser),
          symbol: s,
          firstUpdateIdInEvent: U,
          finalUpdateIdInEvent: u,
          finalUpdateIdInLastStream: pu,
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
    {
      host: 'usdtM',
      path: `${symbol.toLowerCase()}@depth${level}${updateSpeed === '250ms' ? '' : `@${updateSpeed}`}`,
      securityType: 'SOCKET',
      client,
    },
    parseCallback,
  );
}
