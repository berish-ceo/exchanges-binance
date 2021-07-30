import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export type CreateVirtualSubAccountResponse = string;

interface CreateVirtualSubAccountResponseRaw {
  email: 'addsdd_virtual@aasaixwqnoemail.com';
}

export async function createVirtualSubAccount(client: BinanceSignedClient, subAccountString: string) {
  const response = await apiCall<CreateVirtualSubAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/virtualSubAccount',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: { subAccountString },
  });

  return parse<CreateVirtualSubAccountResponseRaw, CreateVirtualSubAccountResponse>(response, ({ email }) => email);
}
