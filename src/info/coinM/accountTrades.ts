export type PositionMode = 'HEDGE' | 'ONE_WAY';
export type MarginType = 'ISOLATED' | 'CROSSED';

export enum ModifyIsolatedPositionMarginTypeEnum {
  ADD_POSITION_MARGIN = 1,
  REDUCE_POSITION_MARGIN = 2,
}

export type IncomeType =
  | 'TRANSFER'
  | 'WELCOME_BONUS'
  | 'FUNDING_FEE'
  | 'REALIZED_PNL'
  | 'COMMISSION'
  | 'INSURANCE_CLEAR'
  | 'DELIVERED_SETTELMENT';

export type AutoCloseType = 'LIQUIDATION' | 'ADL';

export type RulesIndicatorType = 'UFR' | 'IFER' | 'GCR' | 'DR';
