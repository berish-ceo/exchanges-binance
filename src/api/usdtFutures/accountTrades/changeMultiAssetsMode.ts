import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

interface ChangeMultiAssetsModeRaw {
  code: number;
  msg: string;
}

export async function changeMultiAssetsMode(client: BinanceSignedClient, multiAssetsMargin: boolean) {
  await apiCall<ChangeMultiAssetsModeRaw>({
    host: 'usdtM',
    path: '/fapi/v1/multiAssetsMargin',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: { multiAssetsMargin },
  });
}
