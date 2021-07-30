import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetLeftDailyRedemptionQuotaOfFlexibleProductPayload {
  productId: string;
  type: 'FAST' | 'NORMAL';
}

export interface GetLeftDailyRedemptionQuotaOfFlexibleProductResponse {
  asset: string;
  dailyQuota: number;
  leftQuota: number;
  minRedemptionAmount: number;
}

interface GetLeftDailyRedemptionQuotaOfFlexibleProductResponseRaw {
  asset: string;
  dailyQuota: string;
  leftQuota: string;
  minRedemptionAmount: string;
}

export async function getLeftDailyRedemptionQuotaOfFlexibleProduct(
  client: BinanceSignedClient,
  payload: GetLeftDailyRedemptionQuotaOfFlexibleProductPayload,
) {
  const response = await apiCall<GetLeftDailyRedemptionQuotaOfFlexibleProductResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/lending/daily/userRedemptionQuota',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<
    GetLeftDailyRedemptionQuotaOfFlexibleProductResponseRaw,
    GetLeftDailyRedemptionQuotaOfFlexibleProductResponse
  >(response, ({ dailyQuota, leftQuota, minRedemptionAmount, ...other }) => ({
    dailyQuota: parse(dailyQuota, numberParser),
    leftQuota: parse(leftQuota, numberParser),
    minRedemptionAmount: parse(minRedemptionAmount, numberParser),
    ...other,
  }));
}
