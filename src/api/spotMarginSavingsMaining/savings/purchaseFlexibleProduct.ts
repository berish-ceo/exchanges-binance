import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface PurchaseFlexibleProductPayload {
  productId: string;
  amount: number;
}

export type PurchaseFlexibleProductResponse = number;

interface PurchaseFlexibleProductResponseRaw {
  purchaseId: number;
}

export async function purchaseFlexibleProduct(client: BinanceSignedClient, payload: PurchaseFlexibleProductPayload) {
  const response = await apiCall<PurchaseFlexibleProductResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/lending/daily/purchase',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<PurchaseFlexibleProductResponseRaw, PurchaseFlexibleProductResponse>(
    response,
    ({ purchaseId }) => purchaseId,
  );
}
