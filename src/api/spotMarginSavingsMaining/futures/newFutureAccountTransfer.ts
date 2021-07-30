import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface NewFutureAccountTransferPayload {
  asset: string;
  amount: number;
  type: spot.FuturesTransferTypeEnum;
}

export type NewFutureAccountTransferResponse = number;

interface NewFutureAccountTransferResponseRaw {
  tranId: number;
}

export async function newFutureAccountTransfer(client: BinanceSignedClient, payload: NewFutureAccountTransferPayload) {
  const response = await apiCall<NewFutureAccountTransferResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/transfer',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<NewFutureAccountTransferResponseRaw, NewFutureAccountTransferResponse>(response, ({ tranId }) => tranId);
}
