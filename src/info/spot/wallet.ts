export enum SystemStatusTypeEnum {
  NORMAL = 0,
  SYSTEM_MAINTENANCE = 1,
}

export type DailyAccountSnapshotType = 'SPOT' | 'MARGIN' | 'FUTURES';

export enum DepositHistoryStatusEnum {
  PENDING = 0,
  SUCCESS = 1,
  CREDITED_BUT_CANNOT_WITHDRAW = 6,
}

export enum WithdrawHistoryStatusEnum {
  EMAIL_SENT = 0,
  CANCELLED = 1,
  AWAITING_APPROVAL = 2,
  REJECTED = 3,
  PROCESSING = 4,
  FAILURE = 5,
  COMPLETED = 6,
}

export enum TransferTypeEnum {
  EXTERNAL = 0,
  INTERNAL = 1,
}

export type RulesIndicatorType = 'UFR' | 'IFER' | 'GCR';

export type UserUniversalTransferType =
  | 'MAIN_C2C'
  | 'MAIN_UMFUTURE'
  | 'MAIN_CMFUTURE'
  | 'MAIN_MARGIN'
  | 'MAIN_MINING'
  | 'C2C_MAIN'
  | 'C2C_UMFUTURE'
  | 'C2C_MINING'
  | 'C2C_MARGIN'
  | 'UMFUTURE_MAIN'
  | 'UMFUTURE_C2C'
  | 'UMFUTURE_MARGIN'
  | 'CMFUTURE_MAIN'
  | 'CMFUTURE_MARGIN'
  | 'MARGIN_MAIN'
  | 'MARGIN_UMFUTURE'
  | 'MARGIN_CMFUTURE'
  | 'MARGIN_MINING'
  | 'MARGIN_C2C'
  | 'MINING_MAIN'
  | 'MINING_UMFUTURE'
  | 'MINING_C2C'
  | 'MINING_MARGIN';

export type UserUniversalTransferStatusType = 'PENDING' | 'CONFIRMED' | 'FAILED';
