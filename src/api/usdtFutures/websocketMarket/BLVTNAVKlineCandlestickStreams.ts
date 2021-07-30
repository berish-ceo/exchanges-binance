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
import { usdtM } from '../../../info';
export interface BLVTNAVKlineCandlestickStreamsResponse {
  eventTime: Date;
  symbol: string;

  klineStartTime: Date;
  klineCloseTime: Date;
  interval: usdtM.KlineCandlestickChartIntervals;
  firstNAVUpdateTime: Date;
  lastNAVUpdateTime: Date;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  realLeverage: number;
  numberOfNAVUpdate: number;
}

interface BLVTNAVKlineCandlestickStreamsResponseRaw {
  e: string;
  E: number;
  s: string;
  k: {
    t: number;
    T: number;
    s: string;
    i: usdtM.KlineCandlestickChartIntervals;
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
    B: string;
  };
}

export function BLVTNAVKlineCandlestickStreams(
  client: BinanceClient,
  tokenName: string,
  interval: usdtM.KlineCandlestickChartIntervals,
  callback: (data: BLVTNAVKlineCandlestickStreamsResponse, error?: any) => any,
) {
  if (!tokenName) throw new TypeError('BLVTNAVKlineCandlestickStreams tokenName is empty');
  if (typeof tokenName !== 'string') throw new TypeError('BLVTNAVKlineCandlestickStreams tokenName is not string');

  if (!interval) throw new TypeError('BLVTNAVKlineCandlestickStreams interval is empty');

  const parseCallback =
    callback &&
    ((data: BLVTNAVKlineCandlestickStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<BLVTNAVKlineCandlestickStreamsResponseRaw, BLVTNAVKlineCandlestickStreamsResponse>(
        data,
        ({ e, E, s, k, ...other }) =>
          Object.assign(
            {
              eventTime: parse(E, dateParser),
              symbol: s,
              ...other,
            },
            parse(k, ({ t, T, s, i, f, L, o, c, h, l, v, n, x, q, V, Q, B, ...other }) => ({
              klineStartTime: parse(t, dateParser),
              klineCloseTime: parse(T, dateParser),
              interval: i,
              firstNAVUpdateTime: parse(f, dateParser),
              lastNAVUpdateTime: parse(L, dateParser),
              openPrice: parse(o, numberParser),
              closePrice: parse(c, numberParser),
              highPrice: parse(h, numberParser),
              lowPrice: parse(l, numberParser),
              realLeverage: parse(v, numberParser),
              numberOfNAVUpdate: n,
              ...other,
            })),
          ),
      );

      return callback(response);
    });

  return apiCall(
    { host: 'usdtM', path: `${tokenName.toUpperCase()}@nav_Kline_${interval}`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
