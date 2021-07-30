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

export interface KlineCandlestickDataPayload {
  symbol: string;
  interval: spot.KlineCandlestickChartIntervals;
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
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

interface KlineCandlestickDataPayloadRaw {
  symbol: string;
  interval: spot.KlineCandlestickChartIntervals;
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

  const response = await apiCall<KlineCandlestickDataResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/klines',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<KlineCandlestickDataResponseRaw, KlineCandlestickDataResponse>(
    response,
    ([
      openTime,
      open,
      high,
      low,
      close,
      volume,
      closeTime,
      quoteAssetVolume,
      numberOfTrades,
      takerBuyBaseAssetVolume,
      takerBuyQuoteAssetVolume,
      ignore,
    ]) => ({
      openTime: parse(openTime, dateParser),
      open: parse(open, numberParser),
      high: parse(high, numberParser),
      low: parse(low, numberParser),
      close: parse(close, numberParser),
      volume: parse(volume, numberParser),
      closeTime: parse(closeTime, dateParser),
      quoteAssetVolume: parse(quoteAssetVolume, numberParser),
      numberOfTrades: parse(numberOfTrades, numberParser),
      takerBuyBaseAssetVolume: parse(takerBuyBaseAssetVolume, numberParser),
      takerBuyQuoteAssetVolume: parse(takerBuyQuoteAssetVolume, numberParser),
    }),
  );
}
