import { BinanceSignedClient } from '../../../clients';
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

export interface ExchangeInformationResponse {
  exchangeFilters: any[];
  rateLimits: coinM.RateLimitType[];
  serverTime: Date;
  symbols: {
    filters: coinM.SymbolFilter[];
    OrderType: coinM.OrderType[];
    timeInForce: coinM.TimeInForce[];

    symbol: string;
    pair: string;
    contractType: coinM.ContractType;
    deliveryDate: Date;
    onboardDate: Date;
    contractStatus: coinM.ContractStatusType;
    contractSize: number;
    quoteAsset: string;
    baseAsset: string;
    marginAsset: string;
    pricePrecision: number;
    quantityPrecision: number;
    baseAssetPrecision: number;
    quotePrecision: number;
    equalQtyPrecision: number;
    triggerProtect: number;
    maintMarginPercent: number;
    requiredMarginPercent: number;
    underlyingType: string;
    underlyingSubType: string[];
  }[];
  timezone: string;
}
interface ExchangeInformationResponseRaw {
  exchangeFilters: any[];
  rateLimits: coinM.RateLimitType[];
  serverTime: number;
  symbols: {
    filters: coinM.SymbolFilter[];
    OrderType: coinM.OrderType[];
    timeInForce: coinM.TimeInForce[];

    symbol: string;
    pair: string;
    contractType: coinM.ContractType;
    deliveryDate: number;
    onboardDate: number;
    contractStatus: coinM.ContractStatusType;
    contractSize: number;
    quoteAsset: string;
    baseAsset: string;
    marginAsset: string;
    pricePrecision: number;
    quantityPrecision: number;
    baseAssetPrecision: number;
    quotePrecision: number;
    equalQtyPrecision: number;
    triggerProtect: string;
    maintMarginPercent: string;
    requiredMarginPercent: string;
    underlyingType: string;
    underlyingSubType: string[];
  }[];
  timezone: string;
}

export async function exchangeInformation(client: BinanceSignedClient) {
  const response = await apiCall<ExchangeInformationResponseRaw>({
    host: 'spot',
    path: '/dapi/v1/exchangeInfo',
    method: 'GET',
    securityType: 'NONE',

    client,
  });

  return parse<ExchangeInformationResponseRaw, ExchangeInformationResponse>(
    response,
    ({ serverTime, symbols, ...other }) => ({
      serverTime: parse(serverTime, dateParser),
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
