export type SymbolStatus =
  | 'PRE_TRADING'
  | 'TRADING'
  | 'POST_TRADING'
  | 'END_OF_DAY'
  | 'HALT'
  | 'AUCTION_MATCH'
  | 'BREAK';
export type SymbolType = 'SPOT';

export type ExecutionType = 'NEW' | 'CANCELED' | 'REPLACED' | 'REJECTED' | 'TRADE' | 'EXPIRED';
export type OrderStatus =
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELED'
  | 'PENDING_CANCEL'
  | 'REJECTED'
  | 'EXPIRED';
export type OCOStatus = 'RESPONSE' | 'EXEC_STARTED' | 'ALL_DONE';
export type OCOOrderStatus = 'EXECUTING' | 'ALL_DONE' | 'REJECT';

export type ContingencyType = 'OCO';

export type OrderType =
  | 'LIMIT'
  | 'MARKET'
  | 'STOP_LOSS'
  | 'STOP_LOSS_LIMIT'
  | 'TAKE_PROFIT'
  | 'TAKE_PROFIT_LIMIT'
  | 'LIMIT_MAKER';
export type OrderResponseType = 'ACK' | 'RESULT' | 'FULL';
export type OrderSide = 'BUY' | 'SELL';

export type TimeInForce = 'GTC' | 'IOC' | 'FOK';

export type KlineCandlestickChartIntervals =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M';

export type RateLimiters = 'REQUEST_WEIGHT' | 'ORDERS' | 'RAW_REQUESTS';
export type RateLimitIntervals = 'SECOND' | 'MINUTE' | 'DAY';

export interface RateLimitType {
  rateLimitType: RateLimiters;
  interval: RateLimitIntervals;
  intervalNum: number;
  limit: number;
}

export enum MiningSortEnum {
  POSITIVE = 0,
  NEGATIVE = 1,
}

export enum MiningSortColumnEnum {
  MINER_NAME = 1,
  REALTIME_COMPUTING_POWER = 2,
  DAILY_AVERAGE_COMPUTING_POWER = 3,
  REALTIME_REJECTING_RATE = 4,
  LAST_SUBMISSION_TIME = 5,
}

export enum MiningWokerStatusEnum {
  ALL = 0,
  VALID = 1,
  INVALID = 2,
  FAILTURE = 3,
}

export enum MiningProfitTypeEnum {
  MINING_WALLET = 0,
  MERGED_MINING = 1,
  ACTIVITY_BONUS = 2,
  REBATE = 3,
  SMART_POOL = 4,
  MINING_ADDRESS = 5,
  POOL_SAVINGS = 7,
  TRANSFERRED = 8,
  INCOME_TRANSFER = 31,
  HASHRATE_RESALE_MINING_WALLET = 32,
  HASHRATE_RESALE_POOL_SAVINGS = 33,
}

export enum MiningProfitStatusEnum {
  UPDAID = 0,
  PAYING = 1,
  PAID = 2,
}

export enum MiningConfigStatusEnum {
  PROCESSING = 0,
  CANCELLED = 1,
  TERMINATED = 2,
}

export enum SubAccountTransferTypeEnum {
  TRANSFER_IN = 1,
  TRANSFER_OUT = 2,
}

export type TransferAccountType = 'SPOT' | 'USDT_FUTURE' | 'COIN_FUTURE';

export type FlexibleProductStatusType =
  | 'ALL'
  | 'SUBSCRIBABLE'
  | 'UNSUBSCRIBABLE'
  | 'HOLDING'
  | 'REDEEMED'
  | 'PURCHASING';
export type FlexibleProductType = 'ACTIVITY' | 'CUSTOMIZED_FIXED';
export type FlexibleSortByType = 'START_TIME' | 'LOT_SIZE' | 'INTEREST_RATE' | 'DURATION';
export type FlexibleLendingType = 'DAILY' | 'ACTIVITY' | 'CUSTOMIZED_FIXED';
