import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export type EnableLeverageTokenForSubAccountResponse = boolean;

interface EnableLeverageTokenForSubAccountResponseRaw {
  email: string;
  enableBlvt: boolean;
}

export async function enableLeverageTokenForSubAccount(client: BinanceSignedClient, email: string) {
  const response = await apiCall<EnableLeverageTokenForSubAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/blvt/enable',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: { email, enableBlvt: true },
  });

  return parse<EnableLeverageTokenForSubAccountResponseRaw, EnableLeverageTokenForSubAccountResponse>(
    response,
    ({ enableBlvt }) => enableBlvt,
  );
}
