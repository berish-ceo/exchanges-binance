import { RefType } from '../utils';

export type SymbolFilterType =
  | 'PRICE_FILTER'
  | 'PERCENT_PRICE'
  | 'LOT_SIZE'
  | 'MIN_NOTIONAL'
  | 'ICEBERG_PARTS'
  | 'MARKET_LOT_SIZE'
  | 'MAX_NUM_ORDERS'
  | 'MAX_NUM_ALGO_ORDERS'
  | 'MAX_NUM_ICEBERG_ORDERS'
  | 'MAX_POSITION';

export type SymbolFilter =
  | SymbolFilterPriceFilter
  | SymbolFilterPercentPrice
  | SymbolFilterLotSize
  | SymbolFilterMinNotional
  | SymbolFilterIcebergParts
  | SymbolFilterMarketLotSize
  | SymbolFilterMaxNumOrders
  | SymbolFilterMaxNumAlgoOrders
  | SymbolFilterMaxNumIcebergOrders
  | SymbolFilterMaxPosition;

export interface SymbolFilterPriceFilter {
  filterType: RefType<SymbolFilterType, 'PRICE_FILTER'>;
  minPrice: string;
  maxPrice: string;
  tickSize: string;
}

export interface SymbolFilterPercentPrice {
  filterType: RefType<SymbolFilterType, 'PERCENT_PRICE'>;
  multiplierUp: string;
  multiplierDown: string;
  avgPriceMins: number;
}

export interface SymbolFilterLotSize {
  filterType: RefType<SymbolFilterType, 'LOT_SIZE'>;
  minQty: string;
  maxQty: string;
  stepSize: string;
}

export interface SymbolFilterMinNotional {
  filterType: RefType<SymbolFilterType, 'MIN_NOTIONAL'>;
  minNotional: string;
  applyToMarket: boolean;
  avgPriceMins: number;
}

export interface SymbolFilterIcebergParts {
  filterType: RefType<SymbolFilterType, 'ICEBERG_PARTS'>;
  limit: number;
}

export interface SymbolFilterMarketLotSize {
  filterType: RefType<SymbolFilterType, 'MARKET_LOT_SIZE'>;
  minQty: string;
  maxQty: string;
  stepSize: string;
}

export interface SymbolFilterMaxNumOrders {
  filterType: RefType<SymbolFilterType, 'MAX_NUM_ORDERS'>;
  maxNumOrders: number;
}

export interface SymbolFilterMaxNumAlgoOrders {
  filterType: RefType<SymbolFilterType, 'MAX_NUM_ALGO_ORDERS'>;
  maxNumAlgoOrders: number;
}

export interface SymbolFilterMaxNumIcebergOrders {
  filterType: RefType<SymbolFilterType, 'MAX_NUM_ICEBERG_ORDERS'>;
  maxNumIcebergOrders: number;
}

export interface SymbolFilterMaxPosition {
  filterType: RefType<SymbolFilterType, 'MAX_POSITION'>;
  maxPosition: string;
}

export type ExchangeFilterNameType = 'EXCHANGE_MAX_NUM_ORDERS' | 'EXCHANGE_MAX_NUM_ALGO_ORDERS';
export type ExchangeFilterType = ExchangeFilterExchangeMaxNumOrders | ExchangeFilterExchangeMaxNumAlgoOrders;

export interface ExchangeFilterExchangeMaxNumOrders {
  filterType: RefType<ExchangeFilterNameType, 'EXCHANGE_MAX_NUM_ORDERS'>;
  maxNumOrders: number;
}

export interface ExchangeFilterExchangeMaxNumAlgoOrders {
  filterType: RefType<ExchangeFilterNameType, 'EXCHANGE_MAX_NUM_ALGO_ORDERS'>;
  maxNumAlgoOrders: number;
}
