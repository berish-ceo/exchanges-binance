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

export interface AggregateTradeStreamsResponse {
  eventTime: Date;
  symbol: string;
  aggregateTradeId: number;
  price: number;
  quantity: number;
  firstTradeId: number;
  lastTradeId: number;
  tradeTime: Date;
  isBuyerMaker: boolean;
}

interface AggregateTradeStreamsResponseRaw {
  e: string;
  E: number;
  s: string;
  a: number;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
}

export function aggregateTradeStreams(
  client: BinanceClient,
  symbol: string,
  callback: (data: AggregateTradeStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('aggregateTradeStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('aggregateTradeStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: AggregateTradeStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<AggregateTradeStreamsResponseRaw, AggregateTradeStreamsResponse>(
        data,
        ({ e, E, s, a, p, q, f, l, T, m, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: parse(s, stringParser),
          aggregateTradeId: parse(a, numberParser),
          price: parse(p, numberParser),
          quantity: parse(q, numberParser),
          firstTradeId: parse(f, numberParser),
          lastTradeId: parse(l, numberParser),
          tradeTime: parse(T, dateParser),
          isBuyerMaker: parse(m, boolParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'usdtM', path: `${symbol.toLowerCase()}@aggTrade`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
