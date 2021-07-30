import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  dateParser,
} from '@berish/safe-parsing';
import { spot, XOR } from '../../../info';

export type QueryOrderPayload = {
  symbol: string;
} & XOR<{ orderId: number }, { origClientOrderId: string }>;

export async function queryOrder(client: BinanceSignedClient, payload: QueryOrderPayload) {
  const response = await apiCall<spot.OrderQueryResponseRaw>({
    host: 'spot',
    path: '/api/v3/order',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return spot.parseQueryOrder(response);
}
