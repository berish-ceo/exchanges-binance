import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QuerySubAccountAssetsResponse {
  asset: string;
  free: number;
  locked: number;
}

interface QuerySubAccountAssetsResponseRaw {
  balances: {
    asset: string;
    free: number;
    locked: number;
  }[];
}

export async function querySubAccountAssets(client: BinanceSignedClient, email: string) {
  const response = await apiCall<QuerySubAccountAssetsResponseRaw>({
    host: 'spot',
    path: '/sapi/v3/sub-account/assets',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { email },
  });

  return parse<QuerySubAccountAssetsResponseRaw, QuerySubAccountAssetsResponse[]>(response, ({ balances }) =>
    parseArray(balances, (data) => data),
  );
}
