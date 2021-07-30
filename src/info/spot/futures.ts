export enum FuturesTransferTypeEnum {
  FROM_SPOT_TO_USDT_M = 1,
  FROM_USDT_M_TO_SPOT = 2,
  FROM_SPOT_TO_COIN_M = 3,
  FROM_COIN_M_TO_SPOT = 4,
}

export type FuturesTransferStatusType = 'PENDING' | 'CONFIRMED' | 'FAILED';

export type FuturesRepayType = 'NORMAL' | 'COLLATERAL';
export type FuturesDirectionType = 'ADDITIONAL' | 'REDUCED';
export type FuturesCrossCollateralLTVStatus = 'PENDING' | 'COMPLETED';
