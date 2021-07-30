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

export async function queryOpenOCO(client: BinanceSignedClient) {
  const response = await apiCall<spot.OrderOCOQueryResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/openOrderList',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parseArray<spot.OrderOCOQueryResponseRaw, spot.OrderOCOQueryResponse>(response, spot.parseQueryOrderOCO);
}
