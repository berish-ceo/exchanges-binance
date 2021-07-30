import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface UserUniversalTransferPayload {
  type: spot.UserUniversalTransferType;
  asset: string;
  amount: number;
}

export type UserUniversalTransferResponse = number;

interface UserUniversalTransferPayloadRaw {
  type: spot.UserUniversalTransferType;
  asset: string;
  amount: string;
}

interface UserUniversalTransferResponseRaw {
  tranId: number;
}

export async function userUniversalTransfer(client: BinanceSignedClient, payload: UserUniversalTransferPayload) {
  const payloadRaw = parse<UserUniversalTransferPayload, UserUniversalTransferPayloadRaw>(
    payload,
    ({ amount, ...other }) => ({
      amount: parse(amount, stringParser),
      ...other,
    }),
  );

  const response = await apiCall<UserUniversalTransferResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/asset/transfer',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<UserUniversalTransferResponseRaw, UserUniversalTransferResponse>(response, ({ tranId }) => tranId);
}
