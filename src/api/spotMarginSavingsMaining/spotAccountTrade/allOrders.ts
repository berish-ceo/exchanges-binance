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

export interface AllOrdersPayload {
  symbol: string;
  orderId?: number;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

interface AllOrdersPayloadRaw {
  symbol: string;
  orderId?: number;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

export async function allOrders(client: BinanceSignedClient, payload: AllOrdersPayload) {
  const payloadRaw = parse<AllOrdersPayload, AllOrdersPayloadRaw>(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<spot.OrderQueryResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/allOrders',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<spot.OrderQueryResponseRaw, spot.OrderQueryResponse>(response, spot.parseQueryOrder);
}
