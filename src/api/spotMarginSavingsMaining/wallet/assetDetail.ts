import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface AssetDetailResponse {
  asset: string;
  minWithdrawAmount: number;
  depositStatus: boolean;
  withdrawFee: number;
  withdrawStatus: boolean;
  depositTip: string;
}

interface AssetDetailResponseRaw {
  [asset: string]: {
    minWithdrawAmount: string;
    depositStatus: boolean;
    withdrawFee: number;
    withdrawStatus: boolean;
    depositTip: string;
  };
}

export async function assetDetail(client: BinanceSignedClient, asset?: string) {
  const response = await apiCall<AssetDetailResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/asset/assetDetail',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { asset },
  });

  return parse<AssetDetailResponseRaw, AssetDetailResponse[]>(response, (data) =>
    parseArray(Object.entries(data), ([asset, { minWithdrawAmount, ...other }]) => ({
      asset,
      minWithdrawAmount: parse(minWithdrawAmount, numberParser),
      ...other,
    })),
  );
}
