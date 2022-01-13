export type MarginType = 'ISOLATED' | 'CROSSED';

export enum ModifyIsolatedPositionMarginTypeEnum {
  ADD_POSITION_MARGIN = 1,
  REDUCE_POSITION_MARGIN = 2,
}

export type IncomeType =
  | 'TRANSFER'
  | 'WELCOME_BONUS'
  | 'REALIZED_PNL'
  | 'FUNDING_FEE'
  | 'COMMISSION'
  | 'INSURANCE_CLEAR';

export type AutoCloseType = 'LIQUIDATION' | 'ADL';

export type RulesIndicatorType = 'UFR' | 'IFER' | 'GCR' | 'DR';
