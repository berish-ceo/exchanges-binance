import { RefType } from '../utils';

export type SymbolFilterType = 'PRICE_FILTER' | 'LOT_SIZE' | 'MARKET_LOT_SIZE' | 'MAX_NUM_ORDERS' | 'PERCENT_PRICE';

export type SymbolFilter =
  | SymbolFilterPriceFilter
  | SymbolFilterPercentPrice
  | SymbolFilterLotSize
  | SymbolFilterMarketLotSize
  | SymbolFilterMaxNumOrders;

export interface SymbolFilterPriceFilter {
  filterType: RefType<SymbolFilterType, 'PRICE_FILTER'>;
  minPrice: string;
  maxPrice: string;
  tickSize: string;
}

export interface SymbolFilterLotSize {
  filterType: RefType<SymbolFilterType, 'LOT_SIZE'>;
  minQty: string;
  maxQty: string;
  stepSize: string;
}

export interface SymbolFilterMarketLotSize {
  filterType: RefType<SymbolFilterType, 'MARKET_LOT_SIZE'>;
  minQty: string;
  maxQty: string;
  stepSize: string;
}

export interface SymbolFilterMaxNumOrders {
  filterType: RefType<SymbolFilterType, 'MAX_NUM_ORDERS'>;
  limit: number;
}

export interface SymbolFilterPercentPrice {
  filterType: RefType<SymbolFilterType, 'PERCENT_PRICE'>;
  multiplierUp: string;
  multiplierDown: string;
  multiplierDecimal: number;
}
