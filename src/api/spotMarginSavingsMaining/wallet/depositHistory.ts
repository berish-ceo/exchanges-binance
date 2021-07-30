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

export interface DepositHistoryPayload {
  coin?: string;
  status?: spot.DepositHistoryStatusEnum;
  startTime?: Date | number;
  endTime?: Date | number;
  offset?: number;
  limit?: number;
}

export interface DepositHistoryResponse {
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

interface DepositHistoryPayloadRaw {
  coin?: string;
  status?: spot.DepositHistoryStatusEnum;
  startTime?: number;
  endTime?: number;
  offset?: number;
  limit?: number;
}

interface DepositHistoryResponseRaw {
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

export async function depositHistory(client: BinanceSignedClient, payload?: DepositHistoryPayload) {
  const payloadRaw = parse<DepositHistoryPayload, DepositHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<DepositHistoryResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/capital/deposit/hisrec',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<DepositHistoryResponseRaw, DepositHistoryResponse>(
    response,
    ({ amount, insertTime, ...other }) => ({
      amount: parse(amount, numberParser),
      insertTime: parse(insertTime, dateParser),
      ...other,
    }),
  );
}
