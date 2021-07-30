import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export type AccountStatusResponse = string;

interface AccountStatusResponseRaw {
  data: string;
}

export async function accountStatus(client: BinanceSignedClient) {
  const response = await apiCall<AccountStatusResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/account/status',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<AccountStatusResponseRaw, AccountStatusResponse>(response, ({ data }) => data);
}
