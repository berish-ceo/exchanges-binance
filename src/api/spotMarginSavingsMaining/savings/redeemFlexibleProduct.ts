import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface RedeemFlexibleProductPayload {
  productId: string;
  amount: number;
  type: 'FAST' | 'NORMAL';
}

export async function redeemFlexibleProduct(client: BinanceSignedClient, payload: RedeemFlexibleProductPayload) {
  await apiCall<{}>({
    host: 'spot',
    path: '/sapi/v1/lending/daily/redeem',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });
}
