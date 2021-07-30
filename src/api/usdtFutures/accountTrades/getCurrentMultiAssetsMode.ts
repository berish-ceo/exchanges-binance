import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export type GetCurrentMultiAssetsModeResponse = boolean;

interface GetCurrentMultiAssetsModeResponseRaw {
  multiAssetsMargin: boolean;
}

export async function getCurrentMultiAssetsMode(client: BinanceSignedClient) {
  const response = await apiCall<GetCurrentMultiAssetsModeResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/multiAssetsMargin',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<GetCurrentMultiAssetsModeResponseRaw, GetCurrentMultiAssetsModeResponse>(
    response,
    ({ multiAssetsMargin }) => multiAssetsMargin,
  );
}
