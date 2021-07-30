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
export interface IndividualSymbolBookTickerStreamsResponse {
  orderBookUpdateId: number;
  symbol: string;
  pair: string;
  bestBidPrice: number;
  bestBidQuantity: number;
  bestAskPrice: number;
  bestAskQuantity: number;
  transactionTime: Date;
  eventTime: Date;
}

export interface IndividualSymbolBookTickerStreamsResponseRaw {
  e: string;
  u: number;
  s: string;
  ps: string;
  b: string;
  B: string;
  a: string;
  A: string;
  T: number;
  E: number;
}

export function individualSymbolBookTickerStreams(
  client: BinanceClient,
  symbol: string,
  callback: (data: IndividualSymbolBookTickerStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('individualSymbolBookTickerStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('individualSymbolBookTickerStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: IndividualSymbolBookTickerStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<IndividualSymbolBookTickerStreamsResponseRaw, IndividualSymbolBookTickerStreamsResponse>(
        data,
        ({ e, u, s, ps, b, B, a, A, E, T, ...other }) => ({
          orderBookUpdateId: u,
          symbol: s,
          pair: ps,
          bestBidPrice: parse(b, numberParser),
          bestBidQuantity: parse(B, numberParser),
          bestAskPrice: parse(a, numberParser),
          bestAskQuantity: parse(A, numberParser),
          transactionTime: parse(T, dateParser),
          eventTime: parse(E, dateParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'coinM', path: `${symbol.toLowerCase()}@bookTicker`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
