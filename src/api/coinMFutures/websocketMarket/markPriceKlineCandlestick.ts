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
import { coinM } from '../../../info';

export interface MarkPriceKlineCandlestickResponse {
  eventTime: Date;
  pair: string;

  klineStartTime: Date;
  klineCloseTime: Date;
  symbol: string;
  interval: coinM.KlineCandlestickChartIntervals;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  numberOfBasicData: number;
  isThisKlineClosed: boolean;
}

interface MarkPriceKlineCandlestickResponseRaw {
  e: string;
  E: number;
  ps: string;
  k: {
    t: number;
    T: number;
    s: string;
    i: coinM.KlineCandlestickChartIntervals;
    o: string;
    c: string;
    h: string;
    l: string;
    n: number;
    x: boolean;
  };
}

export function markPriceKlineCandlestick(
  client: BinanceClient,
  symbol: string,
  interval: coinM.KlineCandlestickChartIntervals,
  callback: (data: MarkPriceKlineCandlestickResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('markPriceKlineCandlestick symbol is empty');
  if (!interval) throw new TypeError('markPriceKlineCandlestick interval is empty');

  if (typeof symbol !== 'string') throw new TypeError('markPriceKlineCandlestick symbol is not string');

  const parseCallback =
    callback &&
    ((data: MarkPriceKlineCandlestickResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<MarkPriceKlineCandlestickResponseRaw, MarkPriceKlineCandlestickResponse>(
        data,
        ({ e, E, ps, k, ...other }) => ({
          eventTime: parse(E, dateParser),
          pair: ps,
          ...other,

          ...parse(k, ({ t, T, s, i, o, c, h, l, n, x, ...other }) => ({
            klineStartTime: parse(t, dateParser),
            klineCloseTime: parse(T, dateParser),
            symbol: s,
            interval: i,
            openPrice: parse(o, numberParser),
            closePrice: parse(c, numberParser),
            highPrice: parse(h, numberParser),
            lowPrice: parse(l, numberParser),
            numberOfBasicData: n,
            isThisKlineClosed: x,
            ...other,
          })),
        }),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'coinM', path: `${symbol.toLowerCase()}@markPriceKline_${interval}`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
