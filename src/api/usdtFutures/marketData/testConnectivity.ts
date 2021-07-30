import { BinanceClient, BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export async function testConnectivity(client: BinanceClient) {
  await apiCall<{}>({
    host: 'usdtM',
    path: '/fapi/v1/ping',
    method: 'GET',
    securityType: 'NONE',

    client,
  });
}
