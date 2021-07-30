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

export interface _24hrTickerPriceChangeStatisticsResponse {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  weightedAveragePrice: number;
  prevClosePrice: number;
  lastPrice: number;
  lastQuantity: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  openTime: Date;
  closeTime: Date;
  firstId: number;
  lastId: number;
  count: number;
}

interface _24hrTickerPriceChangeStatisticsResponseRaw {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
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
  symbol: string,
): Promise<_24hrTickerPriceChangeStatisticsResponse>;
export async function _24hrTickerPriceChangeStatistics(
  client: BinanceClient,
  symbol?: string,
): Promise<_24hrTickerPriceChangeStatisticsResponse | _24hrTickerPriceChangeStatisticsResponse[]> {
  const response = await apiCall<
    _24hrTickerPriceChangeStatisticsResponseRaw | _24hrTickerPriceChangeStatisticsResponseRaw[]
  >({
    host: 'usdtM',
    path: '/fapi/v1/ticker/24hr',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parseOptional<_24hrTickerPriceChangeStatisticsResponseRaw, _24hrTickerPriceChangeStatisticsResponse>(
    response,
    ({
      priceChange,
      priceChangePercent,
      weightedAvgPrice,
      prevClosePrice,
      lastPrice,
      lastQty,
      openPrice,
      highPrice,
      lowPrice,
      volume,
      quoteVolume,
      openTime,
      closeTime,
      ...other
    }) => ({
      priceChange: parse(priceChange, numberParser),
      priceChangePercent: parse(priceChangePercent, numberParser),
      weightedAveragePrice: parse(weightedAvgPrice, numberParser),
      prevClosePrice: parse(prevClosePrice, numberParser),
      lastPrice: parse(lastPrice, numberParser),
      lastQuantity: parse(lastQty, numberParser),
      openPrice: parse(openPrice, numberParser),
      highPrice: parse(highPrice, numberParser),
      lowPrice: parse(lowPrice, numberParser),
      volume: parse(volume, numberParser),
      quoteVolume: parse(quoteVolume, numberParser),
      openTime: parse(openTime, dateParser),
      closeTime: parse(closeTime, dateParser),
      ...other,
    }),
  );
}
