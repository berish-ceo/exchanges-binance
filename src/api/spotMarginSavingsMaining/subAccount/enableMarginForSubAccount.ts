import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export type EnableMarginForSubAccountResponse = boolean;

interface EnableMarginForSubAccountResponseRaw {
  email: string;
  isMarginEnabled: boolean;
}

export async function enableMarginForSubAccount(client: BinanceSignedClient, email: string) {
  const response = await apiCall<EnableMarginForSubAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/margin/enable',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: { email },
  });

  return parse<EnableMarginForSubAccountResponseRaw, EnableMarginForSubAccountResponse>(
    response,
    ({ isMarginEnabled }) => isMarginEnabled,
  );
}
