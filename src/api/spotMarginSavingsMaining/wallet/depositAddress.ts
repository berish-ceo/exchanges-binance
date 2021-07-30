import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface DepositAddressPayload {
  coin: string;
  network?: string;
}

export interface DepositAddressResponse {
  address: string;
  coin: string;
  tag: string;
  url: string;
}

export async function depositAddress(client: BinanceSignedClient, payload: DepositAddressPayload) {
  const response = await apiCall<DepositAddressResponse>({
    host: 'spot',
    path: '/sapi/v1/capital/deposit/address',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return response;
}
