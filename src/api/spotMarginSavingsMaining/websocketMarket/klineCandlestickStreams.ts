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
import { spot } from '../../../info';

export interface KlineCandlestickStreamsResponse {
  eventTime: Date;
  symbol: string;

  klineStartTime: Date;
  klineCloseTime: Date;
  interval: spot.KlineCandlestickChartIntervals;
  firstTradeId: number;
  lastTradeId: number;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  baseAssetVolume: number;
  numberOfTrades: number;
  isThisKlineClosed: boolean;
  quoteAssetVolume: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

interface KlineCandlestickStreamsResponseRaw {
  e: string;
  E: number;
  s: string;
  k: {
    t: number;
    T: number;
    s: string;
    i: spot.KlineCandlestickChartIntervals;
    f: number;
    L: number;
    o: string;
    c: string;
    h: string;
    l: string;
    v: string;
    n: number;
    x: boolean;
    q: string;
    V: string;
    Q: string;
  };
}

export function klineCandlestickStreams(
  client: BinanceClient,
  symbol: string,
  interval: spot.KlineCandlestickChartIntervals,
  callback: (data: KlineCandlestickStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('klineCandlestickStreams symbol is empty');
  if (!interval) throw new TypeError('klineCandlestickStreams interval is empty');
  if (typeof symbol !== 'string') throw new TypeError('klineCandlestickStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: KlineCandlestickStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<KlineCandlestickStreamsResponseRaw, KlineCandlestickStreamsResponse>(
        data,
        ({ e, E, s, k, ...other }) => ({
          eventTime: parse(E, dateParser),
          symbol: s,
          ...other,
          ...parse(k, ({ t, T, s, i, f, L, o, c, h, l, v, n, x, q, V, Q, ...other }) => ({
            klineStartTime: parse(t, dateParser),
            klineCloseTime: parse(T, dateParser),
            interval: i,
            firstTradeId: f,
            lastTradeId: L,
            openPrice: parse(o, numberParser),
            closePrice: parse(c, numberParser),
            highPrice: parse(h, numberParser),
            lowPrice: parse(l, numberParser),
            baseAssetVolume: parse(v, numberParser),
            numberOfTrades: n,
            isThisKlineClosed: x,
            quoteAssetVolume: parse(q, numberParser),
            takerBuyBaseAssetVolume: parse(V, numberParser),
            takerBuyQuoteAssetVolume: parse(Q, numberParser),
            ...other,
          })),
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'spot', path: `${symbol.toLowerCase()}@kline_${interval}`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
