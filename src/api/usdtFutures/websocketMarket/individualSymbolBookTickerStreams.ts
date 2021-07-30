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
  eventTime: Date;
  transactionTime: Date;
  symbol: string;
  bestBidPrice: number;
  bestBidQuantity: number;
  bestAskPrice: number;
  bestAskQuantity: number;
}

export interface IndividualSymbolBookTickerStreamsResponseRaw {
  e: string;
  u: number;
  E: number;
  T: number;
  s: string;
  b: string;
  B: string;
  a: string;
  A: string;
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
        ({ e, u, E, T, s, b, B, a, A, ...other }) => ({
          orderBookUpdateId: u,
          eventTime: parse(E, dateParser),
          transactionTime: parse(T, dateParser),
          symbol: s,
          bestBidPrice: parse(b, numberParser),
          bestBidQuantity: parse(B, numberParser),
          bestAskPrice: parse(a, numberParser),
          bestAskQuantity: parse(A, numberParser),
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'usdtM', path: `${symbol.toLowerCase()}@bookTicker`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
