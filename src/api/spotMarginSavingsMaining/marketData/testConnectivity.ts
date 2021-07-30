import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';

/**
 * Test connectivity to the Rest API.
 */
export async function testConnectivity(client: BinanceClient) {
  try {
    await apiCall<{}>({
      host: 'spot',
      path: '/api/v3/ping',
      method: 'GET',
      securityType: 'NONE',

      client,
    });

    return true;
  } catch (err) {
    return false;
  }
}
