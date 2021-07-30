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

export interface IndexKlineCandlestickStreamsResponse {
  eventTime: Date;
  pair: string;

  klineStartTime: Date;
  klineCloseTime: Date;
  interval: coinM.KlineCandlestickChartIntervals;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  numberOfBasicData: number;
  isThisKlineClosed: boolean;
}

interface IndexKlineCandlestickStreamsResponseRaw {
  e: string;
  E: number;
  ps: string;
  k: {
    t: number;
    T: number;
    i: coinM.KlineCandlestickChartIntervals;
    o: string;
    c: string;
    h: string;
    l: string;
    n: number;
    x: boolean;
  };
}

export function indexKlineCandlestickStreams(
  client: BinanceClient,
  pair: string,
  interval: coinM.KlineCandlestickChartIntervals,
  callback: (data: IndexKlineCandlestickStreamsResponse, error?: any) => any,
) {
  if (!pair) throw new TypeError('indexKlineCandlestickStreams pair is empty');
  if (!interval) throw new TypeError('indexKlineCandlestickStreams interval is empty');

  if (typeof pair !== 'string') throw new TypeError('indexKlineCandlestickStreams pair is not string');

  const parseCallback =
    callback &&
    ((data: IndexKlineCandlestickStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<IndexKlineCandlestickStreamsResponseRaw, IndexKlineCandlestickStreamsResponse>(
        data,
        ({ e, E, ps, k, ...other }) => ({
          eventTime: parse(E, dateParser),
          pair: ps,
          ...other,

          ...parse(k, ({ t, T, i, o, c, h, l, n, x, ...other }) => ({
            klineStartTime: parse(t, dateParser),
            klineCloseTime: parse(T, dateParser),
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
    { host: 'coinM', path: `${pair.toLowerCase()}@indexPriceKline_${interval}`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
