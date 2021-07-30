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

export type QueryOCOPayload = XOR<{ orderListId: number }, { origClientOrderId: string }>;

export async function queryOCO(client: BinanceSignedClient, payload: QueryOCOPayload) {
  const response = await apiCall<spot.OrderOCOQueryResponseRaw>({
    host: 'spot',
    path: '/api/v3/orderList',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return spot.parseQueryOrderOCO(response);
}
