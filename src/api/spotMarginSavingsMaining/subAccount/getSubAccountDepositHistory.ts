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

export interface GetSubAccountDepositHistoryPayload {
  email: string;
  coin?: string;
  status?: spot.DepositHistoryStatusEnum;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
  offset?: number;
}

export interface GetSubAccountDepositHistoryResponse {
  amount: number;
  coin: string;
  network: string;
  status: spot.DepositHistoryStatusEnum;
  address: string;
  addressTag: string;
  txId: string;
  insertTime: Date;
  transferType: number;
  confirmTimes: string;
}

interface GetSubAccountDepositHistoryPayloadRaw {
  email: string;
  coin?: string;
  status?: spot.DepositHistoryStatusEnum;
  startTime?: number;
  endTime?: number;
  limit?: number;
  offset?: number;
}

interface GetSubAccountDepositHistoryResponseRaw {
  amount: string;
  coin: string;
  network: string;
  status: spot.DepositHistoryStatusEnum;
  address: string;
  addressTag: string;
  txId: string;
  insertTime: number;
  transferType: number;
  confirmTimes: string;
}

export async function getSubAccountDepositHistory(
  client: BinanceSignedClient,
  payload: GetSubAccountDepositHistoryPayload,
) {
  const payloadRaw = parse<GetSubAccountDepositHistoryPayload, GetSubAccountDepositHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetSubAccountDepositHistoryResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/capital/deposit/subHisrec',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<GetSubAccountDepositHistoryResponseRaw, GetSubAccountDepositHistoryResponse>(
    response,
    ({ amount, insertTime, ...other }) => ({
      amount: parse(amount, numberParser),
      insertTime: parse(insertTime, dateParser),
      ...other,
    }),
  );
}
