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
import { spot } from '../../../info';

export async function currentOpenOrders(client: BinanceSignedClient, symbol?: string) {
  const response = await apiCall<spot.OrderQueryResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/openOrders',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return parseArray<spot.OrderQueryResponseRaw, spot.OrderQueryResponse>(response, spot.parseQueryOrder);
}
