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

export interface TradeStreamsResponse {
  eventTime: Date;
  symbol: string;
  tradeId: number;
  price: number;
  quantity: number;
  buyerOrderId: number;
  sellerOrderId: number;
  tradeTime: Date;
  isBuyerMaker: boolean;
}

interface TradeStreamsResponseRaw {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
}

export function tradeStreams(
  client: BinanceClient,
  symbol: string,
  callback: (data: TradeStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('tradeStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('tradeStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: TradeStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<TradeStreamsResponseRaw, TradeStreamsResponse>(
        data,
        ({ e, E, s, t, p, q, b, a, T, m, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          tradeId: t,
          price: parse(p, numberParser),
          quantity: parse(q, numberParser),
          buyerOrderId: b,
          sellerOrderId: a,
          tradeTime: parse(T, dateParser),
          isBuyerMaker: m,
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'spot', path: `${symbol.toLowerCase()}@trade`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
