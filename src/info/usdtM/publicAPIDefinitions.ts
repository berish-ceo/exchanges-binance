export type SymbolType = 'FUTURE';

export type ContractType = 'PERPETUAL' | 'CURRENT_MONTH' | 'NEXT_MONTH' | 'CURRENT_QUARTER' | 'NEXT_QUARTER';
export type ContractStatusType = 'PENDING_TRADING' | 'TRADING' | 'PRE_DELIVERING' | 'DELIVERING' | 'DELIVERED' | 'PRE_SETTLE' | 'SETTLING' | 'CLOSE';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED' | 'EXPIRED';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP' | 'STOP_MARKET' | 'TAKE_PROFIT' | 'TAKE_PROFIT_MARKET' | 'TRAILING_STOP_MARKET';
export type OrderSide = 'BUY' | 'SELL';
export type PositionSide = 'BOTH' | 'LONG' | 'SHORT';
export type TimeInForce = 'GTC' | 'IOC' | 'FOK' | 'GTX';
export type WorkingType = 'MARK_PRICE' | 'CONTRACT_PRICE';
export type ResponseType = 'ACK' | 'RESULT';
export type KlineCandlestickChartIntervals = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';

export type RateLimiters = 'REQUEST_WEIGHT' | 'ORDERS';
export type RateLimitIntervals = 'MINUTE';
export interface RateLimitType {
  rateLimitType: RateLimiters;
  interval: RateLimitIntervals;
  intervalNum: number;
  limit: number;
}
