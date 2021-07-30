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
import { spot } from '../../../info';

export interface GetFutureAccountTransactionHistoryListPayload {
  asset: string;
  startTime: Date | number;
  endTime?: Date | number;
  current?: number;
  size?: number;
}

export interface GetFutureAccountTransactionHistoryListResponse {
  rows: {
    asset: string;
    tranId: number;
    amount: number;
    type: spot.FuturesTransferTypeEnum;
    timestamp: Date;
    status: spot.FuturesTransferStatusType;
  }[];
  total: number;
}

interface GetFutureAccountTransactionHistoryListPayloadRaw {
  asset: string;
  startTime: number;
  endTime?: number;
  current?: number;
  size?: number;
}

interface GetFutureAccountTransactionHistoryListResponseRaw {
  rows: {
    asset: string;
    tranId: number;
    amount: string;
    type: string;
    timestamp: number;
    status: spot.FuturesTransferStatusType;
  }[];
  total: number;
}

export async function getFutureAccountTransactionHistoryList(
  client: BinanceSignedClient,
  payload: GetFutureAccountTransactionHistoryListPayload,
) {
  const payloadRaw = parse<
    GetFutureAccountTransactionHistoryListPayload,
    GetFutureAccountTransactionHistoryListPayloadRaw
  >(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<GetFutureAccountTransactionHistoryListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/transfer',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetFutureAccountTransactionHistoryListResponseRaw, GetFutureAccountTransactionHistoryListResponse>(
    response,
    ({ rows, ...other }) => ({
      rows: parseArray(rows, ({ amount, type, timestamp, ...other }) => ({
        amount: parse(amount, numberParser),
        type: parse(type, numberParser),
        timestamp: parse(timestamp, dateParser),
        ...other,
      })),
      ...other,
    }),
  );
}
