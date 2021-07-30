import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot, XOR } from '../../../info';

export type CancelOrderPayload = {
  symbol: string;
  newClientOrderId?: string;
} & XOR<{ orderId: number }, { origClientOrderId: string }>;

export type CancelOrderResponse = spot.OrderResultResponse;

export async function cancelOrder(client: BinanceSignedClient, payload: CancelOrderPayload) {
  const response = await apiCall<spot.OrderResultResponseRaw>({
    host: 'spot',
    path: '/api/v3/order',
    method: 'DELETE',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return spot.parseOrder(response) as spot.OrderResultResponse;
}
