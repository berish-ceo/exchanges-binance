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
import { usdtM } from '../../../info';

export interface ExchangeInformationResponse {
  exchangeFilters: any[];
  rateLimits: usdtM.RateLimitType[];
  serverTime: Date;
  futuresType: string;
  assets: {
    asset: string;
    marginAvailable: boolean;
    autoAssetExchange: number;
  }[];
  symbols: {
    symbol: string;
    pair: string;
    contractType: usdtM.ContractType;
    deliveryDate: Date;
    onboardDate: Date;
    status: usdtM.ContractStatusType;
    maintMarginPercent: number;
    requiredMarginPercent: number;
    baseAsset: string;
    quoteAsset: string;
    marginAsset: string;
    pricePrecision: number;
    quantityPrecision: number;
    baseAssetPrecision: number;
    quotePrecision: number;
    underlyingType: string;
    underlyingSubType: string[];
    settlePlan: number;
    triggerProtect: number;
    filters: usdtM.SymbolFilter[];
    orderTypes: usdtM.OrderType[];
    timeInForce: usdtM.TimeInForce[];
  }[];
  timezone: string;
}
interface ExchangeInformationResponseRaw {
  exchangeFilters: any[];
  rateLimits: usdtM.RateLimitType[];
  serverTime: number;
  assets: {
    asset: string;
    marginAvailable: boolean;
    autoAssetExchange: string;
  }[];
  futuresType: string;
  symbols: {
    symbol: string;
    pair: string;
    contractType: usdtM.ContractType;
    deliveryDate: number;
    onboardDate: number;
    status: usdtM.ContractStatusType;
    maintMarginPercent: string;
    requiredMarginPercent: string;
    baseAsset: string;
    quoteAsset: string;
    marginAsset: string;
    pricePrecision: number;
    quantityPrecision: number;
    baseAssetPrecision: number;
    quotePrecision: number;
    underlyingType: string;
    underlyingSubType: string[];
    settlePlan: number;
    triggerProtect: string;
    filters: usdtM.SymbolFilter[];
    orderTypes: usdtM.OrderType[];
    timeInForce: usdtM.TimeInForce[];
  }[];
  timezone: string;
}

export async function exchangeInformation(client: BinanceClient) {
  const response = await apiCall<ExchangeInformationResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/exchangeInfo',
    method: 'GET',
    securityType: 'NONE',

    client,
  });

  return parse<ExchangeInformationResponseRaw, ExchangeInformationResponse>(
    response,
    ({ serverTime, symbols, assets, ...other }) => ({
      serverTime: parse(serverTime, dateParser),
      assets: parseArray(assets, ({ autoAssetExchange, ...other }) => ({
        autoAssetExchange: parse(autoAssetExchange, numberParser),
        ...other,
      })),
      symbols: parseArray(
        symbols,
        ({ deliveryDate, onboardDate, maintMarginPercent, requiredMarginPercent, triggerProtect, ...other }) => ({
          deliveryDate: parse(deliveryDate, dateParser),
          onboardDate: parse(onboardDate, dateParser),
          maintMarginPercent: parse(maintMarginPercent, numberParser),
          requiredMarginPercent: parse(requiredMarginPercent, numberParser),
          triggerProtect: parse(triggerProtect, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
