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
import { spot, XOR } from '../../../info';

export type QueryUniversalTransferHistoryPayload = XOR<{ fromEmail?: string }, { toEmail?: string }> & {
  startTime?: Date | number;
  endTime?: Date | number;
  page?: number;
  limit?: number;
};

export interface QueryUniversalTransferHistoryResponse {
  totalCount: number;
  result: {
    tranId: number;
    fromEmail: string;
    toEmail: string;
    asset: string;
    amount: number;
    fromAccountType: spot.TransferAccountType;
    toAccountType: spot.TransferAccountType;
    status: string;
    createTimeStamp: Date;
  }[];
}

interface QueryUniversalTransferHistoryPayloadRaw {
  fromEmail?: string;
  toEmail?: string;
  startTime?: number;
  endTime?: number;
  page?: number;
  limit?: number;
}

interface QueryUniversalTransferHistoryResponseRaw {
  totalCount: number;
  result: {
    tranId: number;
    fromEmail: string;
    toEmail: string;
    asset: string;
    amount: string;
    createTimeStamp: number;
    fromAccountType: spot.TransferAccountType;
    toAccountType: spot.TransferAccountType;
    status: string;
  }[];
}

export async function queryUniversalTransferHistory(
  client: BinanceSignedClient,
  payload?: QueryUniversalTransferHistoryPayload,
) {
  const payloadRaw = parse<QueryUniversalTransferHistoryPayload, QueryUniversalTransferHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<QueryUniversalTransferHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/universalTransfer',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryUniversalTransferHistoryResponseRaw, QueryUniversalTransferHistoryResponse>(
    response,
    ({ result, ...other }) => ({
      result: parseArray(result, ({ amount, createTimeStamp, ...other }) => ({
        amount: parse(amount, numberParser),
        createTimeStamp: parse(createTimeStamp, dateParser),
        ...other,
      })),
      ...other,
    }),
  );
}
