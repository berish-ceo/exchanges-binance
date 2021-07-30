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

export interface IndividualSymbolTickerStreamsResponse {
  eventTime: Date;
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  weightedAveragePrice: number;
  firstTradeBefore24hrWindow: number;
  lastPrice: number;
  lastQuantity: number;
  bestBidPrice: number;
  bestBidQuantity: number;
  bestAskPrice: number;
  bestAskQuantity: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  totalTradedBaseAssetVolume: number;
  totalTradedQuoteAssetVolume: number;
  statisticsOpenTime: Date;
  statisticsCloseTime: Date;
  firstTradeId: number;
  lastTradeId: number;
  totalNumberOfTrades: number;
}

export interface IndividualSymbolTickerStreamsResponseRaw {
  e: string;
  E: number;
  s: string;
  p: string;
  P: string;
  w: string;
  x: string;
  c: string;
  Q: string;
  b: string;
  B: string;
  a: string;
  A: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
  O: number;
  C: number;
  F: number;
  L: number;
  n: number;
}

export function individualSymbolTickerStreams(
  client: BinanceClient,
  symbol: string,
  callback: (data: IndividualSymbolTickerStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('individualSymbolTickerStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('individualSymbolTickerStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: IndividualSymbolTickerStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<IndividualSymbolTickerStreamsResponseRaw, IndividualSymbolTickerStreamsResponse>(
        data,
        ({ e, E, s, p, P, w, x, c, Q, b, B, a, A, o, h, l, v, q, O, C, F, L, n, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          priceChange: parse(p, numberParser),
          priceChangePercent: parse(P, numberParser),
          weightedAveragePrice: parse(w, numberParser),
          firstTradeBefore24hrWindow: parse(x, numberParser),
          lastPrice: parse(c, numberParser),
          lastQuantity: parse(Q, numberParser),
          bestBidPrice: parse(b, numberParser),
          bestBidQuantity: parse(B, numberParser),
          bestAskPrice: parse(a, numberParser),
          bestAskQuantity: parse(A, numberParser),
          openPrice: parse(o, numberParser),
          highPrice: parse(h, numberParser),
          lowPrice: parse(l, numberParser),
          totalTradedBaseAssetVolume: parse(v, numberParser),
          totalTradedQuoteAssetVolume: parse(q, numberParser),
          statisticsOpenTime: parse(O, dateParser),
          statisticsCloseTime: parse(C, dateParser),
          firstTradeId: F,
          lastTradeId: L,
          totalNumberOfTrades: n,
          ...other,
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'spot', path: `${symbol.toLowerCase()}@ticker`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
