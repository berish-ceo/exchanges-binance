import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface PurchaseFixedActivityProjectPayload {
  projectId: string;
  lot: number;
}

export type PurchaseFixedActivityProjectResponse = string;

interface PurchaseFixedActivityProjectResponseRaw {
  purchaseId: string;
}

export async function purchaseFixedActivityProject(
  client: BinanceSignedClient,
  payload: PurchaseFixedActivityProjectPayload,
) {
  const response = await apiCall<PurchaseFixedActivityProjectResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/lending/customizedFixed/purchase',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<PurchaseFixedActivityProjectResponseRaw, PurchaseFixedActivityProjectResponse>(
    response,
    ({ purchaseId }) => purchaseId,
  );
}
