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
export interface DiffBookDepthStreamsResponse {
  eventTime: Date;
  transactionTime: Date;
  symbol: string;
  firstUpdateIdInEvent: number;
  finalUpdateIdInEvent: number;
  finalUpdateIdInLastStream: number;
  bids: { price: number; quantity: number }[];
  asks: { price: number; quantity: number }[];
}

interface DiffBookDepthStreamsResponseRaw {
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

export function diffBookDepthStreams(
  client: BinanceClient,
  symbol: string,
  updateSpeed: '100ms' | '250ms' | '500ms',
  callback: (data: DiffBookDepthStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('diffBookDepthStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('diffBookDepthStreams symbol is not string');

  if (!updateSpeed) throw new TypeError('diffBookDepthStreams updateSpeed is empty');
  if (updateSpeed !== '100ms' && updateSpeed !== '250ms' && updateSpeed !== '500ms')
    throw new TypeError('diffBookDepthStreams updateSpeed is not 100ms, 250ms or 500ms');

  const parseCallback =
    callback &&
    ((data: DiffBookDepthStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<DiffBookDepthStreamsResponseRaw, DiffBookDepthStreamsResponse>(
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
      path: `${symbol.toLowerCase()}@depth${updateSpeed === '250ms' ? '' : `@${updateSpeed}`}`,
      securityType: 'SOCKET',
      client,
    },
    parseCallback,
  );
}
