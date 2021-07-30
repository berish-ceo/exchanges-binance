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

export type CancelOCOPayload = {
  symbol: string;
  newClientOrderId?: string;
} & XOR<{ orderListId: number }, { listClientOrderId: string }>;

export type CancelOCOResponse = spot.OrderOCOResultResponse;

export async function cancelOCO(client: BinanceSignedClient, payload: CancelOCOPayload) {
  const response = await apiCall<spot.OrderOCOResultResponseRaw>({
    host: 'spot',
    path: '/api/v3/orderList',
    method: 'DELETE',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return spot.parseOrderOCO(response) as CancelOCOResponse;
}
