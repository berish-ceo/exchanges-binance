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

export async function cancelAllOpenOrdersOnSymbol(client: BinanceSignedClient, symbol: string) {
  const response = await apiCall<(spot.OrderResultResponseRaw | spot.OrderOCOResultResponseRaw)[]>({
    host: 'spot',
    path: '/api/v3/openOrders',
    method: 'DELETE',
    securityType: 'TRADE',

    client,
    data: { symbol },
  });

  return parseArray<
    spot.OrderResultResponseRaw | spot.OrderOCOResultResponseRaw,
    spot.OrderResultResponse | spot.OrderOCOResultResponse
  >(response, (data) => ('contingencyType' in data ? spot.parseOrderOCO(data) : spot.parseOrder(data)));
}
