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
import { XOR } from '../../../info';

export type QuerySubAccountSpotAssetTransferHistoryPayload = XOR<{ fromEmail?: string }, { toEmail?: string }> & {
  startTime?: Date | number;
  endTime?: Date | number;
  page?: number;
  limit?: number;
};

export interface QuerySubAccountSpotAssetTransferHistoryResponse {
  from: string;
  to: string;
  asset: string;
  quantity: number;
  status: string;
  tranId: number;
  time: Date;
}

type QuerySubAccountSpotAssetTransferHistoryPayloadRaw = ({ fromEmail?: string } | { toEmail?: string }) & {
  startTime?: number;
  endTime?: number;
  page?: number;
  limit?: number;
};

interface QuerySubAccountSpotAssetTransferHistoryResponseRaw {
  from: string;
  to: string;
  asset: string;
  qty: string;
  status: string;
  tranId: number;
  time: number;
}

export async function querySubAccountSpotAssetTransferHistory(
  client: BinanceSignedClient,
  payload?: QuerySubAccountSpotAssetTransferHistoryPayload,
) {
  const payloadRaw = parse<
    QuerySubAccountSpotAssetTransferHistoryPayload,
    QuerySubAccountSpotAssetTransferHistoryPayloadRaw
  >(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<QuerySubAccountSpotAssetTransferHistoryResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/sub-account/sub/transfer/history',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<
    QuerySubAccountSpotAssetTransferHistoryResponseRaw,
    QuerySubAccountSpotAssetTransferHistoryResponse
  >(response, ({ qty, time, ...other }) => ({
    quantity: parse(qty, numberParser),
    time: parse(time, dateParser),
    ...other,
  }));
}
