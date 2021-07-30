import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface WithdrawPayload {
  coin: string;
  address: string;
  amount: number;

  withdrawOrderId?: string;
  network?: string;
  addressTag?: string;
  transactionFeeFlag?: boolean;
  name?: string;
}

export type WithdrawResponse = string;

interface WithdrawResponseRaw {
  id: string;
}

export async function withdraw(client: BinanceSignedClient, payload: WithdrawPayload) {
  const response = await apiCall<WithdrawResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/capital/withdraw/apply',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<WithdrawResponseRaw, WithdrawResponse>(response, ({ id }) => id);
}
