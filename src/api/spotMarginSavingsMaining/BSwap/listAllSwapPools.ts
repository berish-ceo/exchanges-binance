import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface ListAllSwapPoolsResponse {
  poolId: number;
  poolName: string;
  assets: string[];
}

export async function listAllSwapPools(client: BinanceSignedClient) {
  const response = await apiCall<ListAllSwapPoolsResponse>({
    host: 'spot',
    path: '/sapi/v1/bswap/pools',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return response;
}
