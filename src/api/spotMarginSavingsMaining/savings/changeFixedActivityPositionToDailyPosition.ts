import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface ChangeFixedActivityPositionToDailyPositionPayload {
  projectId: string;
  lot: number;
  position?: number;
}

export type ChangeFixedActivityPositionToDailyPositionResponse = number;

interface ChangeFixedActivityPositionToDailyPositionResponseRaw {
  dailyPurchaseId: number;
  success: boolean;
  time: number;
}

export async function changeFixedActivityPositionToDailyPosition(
  client: BinanceSignedClient,
  payload: ChangeFixedActivityPositionToDailyPositionPayload,
) {
  const response = await apiCall<ChangeFixedActivityPositionToDailyPositionResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/lending/positionChanged',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<
    ChangeFixedActivityPositionToDailyPositionResponseRaw,
    ChangeFixedActivityPositionToDailyPositionResponse
  >(response, ({ dailyPurchaseId }) => dailyPurchaseId);
}
