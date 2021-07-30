import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetBLVTUserLimitInfoResponse {
  tokenName: string;
  userDailyTotalPurchaseLimit: number;
  userDailyTotalRedeemLimit: number;
}

interface GetBLVTUserLimitInfoResponseRaw {
  tokenName: string;
  userDailyTotalPurchaseLimit: string;
  userDailyTotalRedeemLimit: string;
}

export async function getBLVTUserLimitInfo(client: BinanceSignedClient, tokenName?: string) {
  const response = await apiCall<GetBLVTUserLimitInfoResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/blvt/userLimit',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { tokenName },
  });

  return parseArray<GetBLVTUserLimitInfoResponseRaw, GetBLVTUserLimitInfoResponse>(
    response,
    ({ userDailyTotalPurchaseLimit, userDailyTotalRedeemLimit, ...other }) => ({
      userDailyTotalPurchaseLimit: parse(userDailyTotalPurchaseLimit, numberParser),
      userDailyTotalRedeemLimit: parse(userDailyTotalRedeemLimit, numberParser),
      ...other,
    }),
  );
}
