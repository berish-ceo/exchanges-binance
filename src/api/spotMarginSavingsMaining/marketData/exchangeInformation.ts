import type { BinanceClient } from '../../../clients';
import type { spot } from '../../../info';

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

export interface ExchangeInformationResponse {
  timezone: string;
  serverTime: Date;
  rateLimits: spot.RateLimitType[];
  exchangeFilters: spot.ExchangeFilterType[];
  symbols: {
    symbol: string;
    status: spot.SymbolStatus;
    baseAsset: string;
    baseAssetPrecision: number;
    quoteAsset: string;
    quotePrecision: number;
    quoteAssetPrecision: number;
    baseCommissionPrecision: number;
    quoteCommissionPrecision: number;
    orderTypes: spot.OrderType[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    quoteOrderQtyMarketAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
    filters: spot.SymbolFilter[];
    permissions: spot.PermissionType[];
  }[];
}

interface ExchangeInformationResponseRaw {
  timezone: string;
  serverTime: number;
  rateLimits: spot.RateLimitType[];
  exchangeFilters: spot.ExchangeFilterType[];
  symbols: {
    symbol: string;
    status: spot.SymbolStatus;
    baseAsset: string;
    baseAssetPrecision: number;
    quoteAsset: string;
    quotePrecision: number;
    quoteAssetPrecision: number;
    baseCommissionPrecision: number;
    quoteCommissionPrecision: number;
    orderTypes: spot.OrderType[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    quoteOrderQtyMarketAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
    filters: spot.SymbolFilter[];
    permissions: spot.PermissionType[];
  }[];
}

/**
 * Current exchange trading rules and symbol information
 * */
export async function exchangeInformation(client: BinanceClient) {
  const response = await apiCall<ExchangeInformationResponseRaw>({
    host: 'spot',
    path: '/api/v3/exchangeInfo',
    method: 'GET',
    securityType: 'NONE',

    client,
  });

  return parse<ExchangeInformationResponseRaw, ExchangeInformationResponse>(response, ({ serverTime, ...other }) => ({
    serverTime: parse(serverTime, dateParser),
    ...other,
  }));
}
