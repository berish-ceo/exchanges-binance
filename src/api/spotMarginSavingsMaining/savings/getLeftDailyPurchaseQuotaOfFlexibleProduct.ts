import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetLeftDailyPurchaseQuotaOfFlexibleProductResponse {
  asset: string;
  leftQuota: number;
}

interface GetLeftDailyPurchaseQuotaOfFlexibleProductResponseRaw {
  asset: string;
  leftQuota: string;
}

export async function getLeftDailyPurchaseQuotaOfFlexibleProduct(client: BinanceSignedClient, productId: string) {
  const response = await apiCall<GetLeftDailyPurchaseQuotaOfFlexibleProductResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/lending/daily/userLeftQuota',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { productId },
  });

  return parse<
    GetLeftDailyPurchaseQuotaOfFlexibleProductResponseRaw,
    GetLeftDailyPurchaseQuotaOfFlexibleProductResponse
  >(response, ({ leftQuota, ...other }) => ({ leftQuota: parse(leftQuota, numberParser), ...other }));
}
