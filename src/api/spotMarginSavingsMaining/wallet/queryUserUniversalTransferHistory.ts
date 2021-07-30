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

export interface QueryUserUniversalTransferHistoryPayload {
  type: spot.UserUniversalTransferType;
  startTime?: Date | number;
  endTime?: Date | number;
  current?: number;
  size?: number;
}

export interface QueryUserUniversalTransferHistoryResponse {
  total: number;
  rows: {
    asset: string;
    amount: number;
    type: spot.UserUniversalTransferType;
    status: spot.UserUniversalTransferStatusType;
    tranId: number;
    timestamp: Date;
  }[];
}

interface QueryUserUniversalTransferHistoryPayloadRaw {
  type: spot.UserUniversalTransferType;
  startTime?: number;
  endTime?: number;
  current?: number;
  size?: number;
}

interface QueryUserUniversalTransferHistoryResponseRaw {
  total: number;
  rows: {
    asset: string;
    amount: string;
    type: spot.UserUniversalTransferType;
    status: spot.UserUniversalTransferStatusType;
    tranId: number;
    timestamp: number;
  }[];
}

export async function queryUserUniversalTransferHistory(
  client: BinanceSignedClient,
  payload: QueryUserUniversalTransferHistoryPayload,
) {
  const payloadRaw = parse<QueryUserUniversalTransferHistoryPayload, QueryUserUniversalTransferHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<QueryUserUniversalTransferHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/asset/transfer',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryUserUniversalTransferHistoryResponseRaw, QueryUserUniversalTransferHistoryResponse>(
    response,
    ({ rows, ...other }) => ({
      rows: parseArray(rows, ({ amount, timestamp, ...other }) => ({
        amount: parse(amount, numberParser),
        timestamp: parse(timestamp, dateParser),
        ...other,
      })),
      ...other,
    }),
  );
}
