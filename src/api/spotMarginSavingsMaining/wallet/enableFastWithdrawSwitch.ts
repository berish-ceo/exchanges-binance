import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export async function enableFastWithdrawSwitch(client: BinanceSignedClient) {
  await apiCall<{}>({
    host: 'spot',
    path: '/sapi/v1/account/enableFastWithdrawSwitch',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
  });
}
