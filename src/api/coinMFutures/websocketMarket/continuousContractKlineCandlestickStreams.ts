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

export interface ContinuousContractKlineCandlestickStreamsResponse {
  eventTime: Date;
  pair: string;
  contractType: coinM.ContractType;

  klineStartTime: Date;
  klineCloseTime: Date;
  interval: coinM.KlineCandlestickChartIntervals;
  firstTradeId: number;
  lastTradeId: number;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  numberOfTrades: number;
  isThisKlineClosed: boolean;
  baseAssetVolume: number;
  takerBuyVolume: number;
  takerBuyBaseAssetVolume: number;
}

interface ContinuousContractKlineCandlestickStreamsResponseRaw {
  e: string;
  E: number;
  ps: string;
  ct: coinM.ContractType;
  k: {
    t: number;
    T: number;
    i: coinM.KlineCandlestickChartIntervals;
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

export function continuousContractKlineCandlestickStreams(
  client: BinanceClient,
  pair: string,
  contractType: coinM.ContractType,
  interval: coinM.KlineCandlestickChartIntervals,
  callback: (data: ContinuousContractKlineCandlestickStreamsResponse, error?: any) => any,
) {
  if (!pair) throw new TypeError('continuousContractKlineCandlestickStreams pair is empty');
  if (!contractType) throw new TypeError('continuousContractKlineCandlestickStreams contractType is empty');
  if (!interval) throw new TypeError('continuousContractKlineCandlestickStreams interval is empty');

  if (typeof pair !== 'string') throw new TypeError('continuousContractKlineCandlestickStreams pair is not string');

  const parseCallback =
    callback &&
    ((data: ContinuousContractKlineCandlestickStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<
        ContinuousContractKlineCandlestickStreamsResponseRaw,
        ContinuousContractKlineCandlestickStreamsResponse
      >(data, ({ e, E, ps, ct, k, ...other }) => ({
        eventTime: parse(E, dateParser),
        pair: ps,
        contractType: ct,
        ...other,

        ...parse(k, ({ t, T, i, f, L, o, c, h, l, v, n, x, q, V, Q, ...other }) => ({
          klineStartTime: parse(t, dateParser),
          klineCloseTime: parse(T, dateParser),
          interval: i,
          firstTradeId: f,
          lastTradeId: L,
          openPrice: parse(o, numberParser),
          closePrice: parse(c, numberParser),
          highPrice: parse(h, numberParser),
          lowPrice: parse(l, numberParser),
          volume: parse(v, numberParser),
          numberOfTrades: n,
          isThisKlineClosed: x,
          baseAssetVolume: parse(q, numberParser),
          takerBuyVolume: parse(V, numberParser),
          takerBuyBaseAssetVolume: parse(Q, numberParser),
          ...other,
        })),
      }));

      return callback(response);
    });

  return apiCall(
    {
      host: 'coinM',
      path: `${pair.toLowerCase()}_${contractType.toLowerCase()}@continuousKline_${interval}`,
      securityType: 'SOCKET',
      client,
    },
    parseCallback,
  );
}
