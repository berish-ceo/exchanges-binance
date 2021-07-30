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
import { coinM } from '../../../info';

export interface KlineCandlestickDataPayload {
  symbol: string;
  interval: coinM.KlineCandlestickChartIntervals;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface KlineCandlestickDataResponse {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: Date;
  baseAssetVolume: number;
  numberOfTrades: number;
  takerBuyVolume: number;
  takerBuyBaseAssetVolume: number;
}

interface KlineCandlestickDataPayloadRaw {
  symbol: string;
  interval: coinM.KlineCandlestickChartIntervals;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

type KlineCandlestickDataResponseRaw = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

export async function klineCandlestickData(client: BinanceClient, payload: KlineCandlestickDataPayload) {
  const payloadRaw = parse<KlineCandlestickDataPayload, KlineCandlestickDataPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<KlineCandlestickDataResponseRaw>({
    host: 'usdtM',
    path: '/dapi/v1/klines',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parse<KlineCandlestickDataResponseRaw, KlineCandlestickDataResponse>(
    response,
    ([
      openTime,
      open,
      high,
      low,
      close,
      volume,
      closeTime,
      baseAssetVolume,
      numberOfTrades,
      takerBuyBaseAssetVolume,
      takerBuyVolume,
      ignore,
    ]) => ({
      openTime: parse(openTime, dateParser),
      open: parse(open, numberParser),
      high: parse(high, numberParser),
      low: parse(low, numberParser),
      close: parse(close, numberParser),
      volume: parse(volume, numberParser),
      closeTime: parse(closeTime, dateParser),
      baseAssetVolume: parse(baseAssetVolume, numberParser),
      numberOfTrades: parse(numberOfTrades, numberParser),
      takerBuyVolume: parse(takerBuyVolume, numberParser),
      takerBuyBaseAssetVolume: parse(takerBuyBaseAssetVolume, numberParser),
    }),
  );
}
