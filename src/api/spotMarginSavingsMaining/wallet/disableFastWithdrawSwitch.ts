import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';

export async function disableFastWithdrawSwitch(client: BinanceSignedClient) {
  await apiCall<{}>({
    host: 'spot',
    path: '/sapi/v1/account/disableFastWithdrawSwitch',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
  });
}
