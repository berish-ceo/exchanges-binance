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

export interface QuerySubAccountFuturesAssetTransferHistoryPayload {
  email: string;
  futuresType: spot.FuturesTypeEnum;
  startTime?: Date | number;
  endTime?: Date | number;
  page?: number;
  limit?: number;
}

export interface QuerySubAccountFuturesAssetTransferHistoryResponse {
  from: string;
  to: string;
  asset: string;
  quantity: number;
  tranId: number;
  time: Date;
}

interface QuerySubAccountFuturesAssetTransferHistoryPayloadRaw {
  email: string;
  futuresType: spot.FuturesTypeEnum;
  startTime?: number;
  endTime?: number;
  page?: number;
  limit?: number;
}

interface QuerySubAccountFuturesAssetTransferHistoryResponseRaw {
  success: boolean;
  futuresType: spot.FuturesTypeEnum;
  transfers: {
    from: string;
    to: string;
    asset: string;
    qty: string;
    tranId: number;
    time: number;
  }[];
}

export async function querySubAccountFuturesAssetTransferHistory(
  client: BinanceSignedClient,
  payload: QuerySubAccountFuturesAssetTransferHistoryPayload,
) {
  const payloadRaw = parse<
    QuerySubAccountFuturesAssetTransferHistoryPayload,
    QuerySubAccountFuturesAssetTransferHistoryPayloadRaw
  >(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<QuerySubAccountFuturesAssetTransferHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/futures/internalTransfer',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<
    QuerySubAccountFuturesAssetTransferHistoryResponseRaw,
    QuerySubAccountFuturesAssetTransferHistoryResponse[]
  >(response, ({ transfers }) =>
    parseArray(transfers, ({ qty, time, ...other }) => ({
      quantity: parse(qty, numberParser),
      time: parse(time, dateParser),
      ...other,
    })),
  );
}
