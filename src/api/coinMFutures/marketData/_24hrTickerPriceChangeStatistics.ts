import { BinanceClient, BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  parseOptional,
  dateParser,
} from '@berish/safe-parsing';

export type _24hrTickerPriceChangeStatisticsPayload =
  | {
      symbol?: string;
    }
  | {
      pair?: string;
    };
export interface _24hrTickerPriceChangeStatisticsResponse {
  symbol: string;
  pair: string;
  priceChange: number;
  priceChangePercent: number;
  weightedAveragePrice: number;
  lastPrice: number;
  lastQuantity: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  baseVolume: number;
  openTime: Date;
  closeTime: Date;
  firstId: number;
  lastId: number;
  count: number;
}

interface _24hrTickerPriceChangeStatisticsResponseRaw {
  symbol: string;
  pair: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  lastPrice: string;
  lastQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  baseVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}
export async function _24hrTickerPriceChangeStatistics(
  client: BinanceClient,
): Promise<_24hrTickerPriceChangeStatisticsResponse[]>;
export async function _24hrTickerPriceChangeStatistics(
  client: BinanceClient,
  payload?: _24hrTickerPriceChangeStatisticsPayload,
): Promise<_24hrTickerPriceChangeStatisticsResponse>;
export async function _24hrTickerPriceChangeStatistics(
  client: BinanceClient,
  payload?: _24hrTickerPriceChangeStatisticsPayload,
): Promise<_24hrTickerPriceChangeStatisticsResponse | _24hrTickerPriceChangeStatisticsResponse[]> {
  const response = await apiCall<
    _24hrTickerPriceChangeStatisticsResponseRaw | _24hrTickerPriceChangeStatisticsResponseRaw[]
  >({
    host: 'usdtM',
    path: '/dapi/v1/ticker/24hr',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payload,
  });

  return parseOptional<_24hrTickerPriceChangeStatisticsResponseRaw, _24hrTickerPriceChangeStatisticsResponse>(
    response,
    ({
      priceChange,
      priceChangePercent,
      weightedAvgPrice,
      lastPrice,
      lastQty,
      openPrice,
      highPrice,
      lowPrice,
      volume,
      baseVolume,
      openTime,
      closeTime,
      ...other
    }) => ({
      priceChange: parse(priceChange, numberParser),
      priceChangePercent: parse(priceChangePercent, numberParser),
      weightedAveragePrice: parse(weightedAvgPrice, numberParser),
      lastPrice: parse(lastPrice, numberParser),
      lastQuantity: parse(lastQty, numberParser),
      openPrice: parse(openPrice, numberParser),
      highPrice: parse(highPrice, numberParser),
      lowPrice: parse(lowPrice, numberParser),
      volume: parse(volume, numberParser),
      baseVolume: parse(baseVolume, numberParser),
      openTime: parse(openTime, dateParser),
      closeTime: parse(closeTime, dateParser),
      ...other,
    }),
  );
}
