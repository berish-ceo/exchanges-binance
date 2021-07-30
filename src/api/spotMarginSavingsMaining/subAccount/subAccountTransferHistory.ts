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

export interface SubAccountTransferHistoryPayload {
  asset?: string;
  type?: spot.SubAccountTransferTypeEnum;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface SubAccountTransferHistoryResponse {
  counterParty: 'master' | 'subAccount';
  email: string;
  type: spot.SubAccountTransferTypeEnum;
  asset: string;
  quantity: number;
  fromAccountType: string;
  toAccountType: string;
  status: string;
  tranId: number;
  time: Date;
}

interface SubAccountTransferHistoryPayloadRaw {
  asset?: string;
  type?: spot.SubAccountTransferTypeEnum;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface SubAccountTransferHistoryResponseRaw {
  counterParty: 'master' | 'subAccount';
  email: string;
  type: spot.SubAccountTransferTypeEnum;
  asset: string;
  qty: string;
  fromAccountType: string;
  toAccountType: string;
  status: string;
  tranId: number;
  time: number;
}

export async function subAccountTransferHistory(
  client: BinanceSignedClient,
  payload: SubAccountTransferHistoryPayload,
) {
  const payloadRaw = parse<SubAccountTransferHistoryPayload, SubAccountTransferHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<SubAccountTransferHistoryResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/sub-account/transfer/subUserHistory',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<SubAccountTransferHistoryResponseRaw, SubAccountTransferHistoryResponse>(
    response,
    ({ qty, time, ...other }) => ({
      quantity: parse(qty, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
