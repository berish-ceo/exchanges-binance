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

export interface WithdrawHistoryPayload {
  coin?: string;
  status?: spot.WithdrawHistoryStatusEnum;
  offset?: number;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface WithdrawHistoryResponse {
  address: string;
  amount: number;
  applyTime: Date;
  coin: string;
  id: string;
  withdrawOrderId: string;
  network: string;
  transferType: spot.TransferTypeEnum;
  status: spot.WithdrawHistoryStatusEnum;
  txId: string;
}

interface WithdrawHistoryPayloadRaw {
  coin?: string;
  status?: spot.WithdrawHistoryStatusEnum;
  offset?: number;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface WithdrawHistoryResponseRaw {
  address: string;
  amount: string;
  applyTime: string;
  coin: string;
  id: string;
  withdrawOrderId: string;
  network: string;
  transferType: spot.TransferTypeEnum;
  status: spot.WithdrawHistoryStatusEnum;
  txId: string;
}

export async function withdrawHistory(client: BinanceSignedClient, payload?: WithdrawHistoryPayload) {
  const payloadRaw = parse<WithdrawHistoryPayload, WithdrawHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<WithdrawHistoryResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/capital/withdraw/history',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<WithdrawHistoryResponseRaw, WithdrawHistoryResponse>(
    response,
    ({ amount, applyTime, ...other }) => ({
      amount: parse(amount, numberParser),
      applyTime: parse(applyTime, dateParser),
      ...other,
    }),
  );
}
