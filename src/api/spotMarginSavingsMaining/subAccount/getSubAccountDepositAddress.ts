import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetSubAccountDepositAddressPayload {
  email: string;
  coin: string;
  network?: string;
}

export interface GetSubAccountDepositAddressResponse {
  address: string;
  coin: string;
  tag: string;
  url: string;
}

export async function getSubAccountDepositAddress(
  client: BinanceSignedClient,
  payload: GetSubAccountDepositAddressPayload,
) {
  const response = await apiCall<GetSubAccountDepositAddressResponse>({
    host: 'spot',
    path: '/sapi/v1/capital/deposit/subAddress',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return response;
}
