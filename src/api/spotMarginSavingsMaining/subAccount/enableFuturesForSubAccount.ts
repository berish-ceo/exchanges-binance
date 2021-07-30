import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export type EnableFuturesForSubAccountResponse = boolean;

interface EnableFuturesForSubAccountResponseRaw {
  email: string;

  isFuturesEnabled: boolean;
}

export async function enableFuturesForSubAccount(client: BinanceSignedClient, email: string) {
  const response = await apiCall<EnableFuturesForSubAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/futures/enable',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: { email },
  });

  return parse<EnableFuturesForSubAccountResponseRaw, EnableFuturesForSubAccountResponse>(
    response,
    ({ isFuturesEnabled }) => isFuturesEnabled,
  );
}
