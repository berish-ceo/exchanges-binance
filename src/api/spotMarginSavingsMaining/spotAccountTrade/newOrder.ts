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
import { spot, RefType } from '../../../info';

export type NewOrderPayload<OrderResponseType extends spot.OrderResponseType = spot.OrderResponseType> =
  spot.NewOrderPayload<OrderResponseType>;

export async function newOrder(
  client: BinanceSignedClient,
  payload: spot.NewOrderPayload<'FULL'>,
): Promise<spot.OrderFullResponse>;
export async function newOrder(
  client: BinanceSignedClient,
  payload: spot.NewOrderPayload<'RESULT'>,
): Promise<spot.OrderResultResponse>;
export async function newOrder(
  client: BinanceSignedClient,
  payload: spot.NewOrderPayload<'ACK'>,
): Promise<spot.OrderACKResponse>;
export async function newOrder(
  client: BinanceSignedClient,
  payload: spot.NewOrderPayload,
): Promise<spot.OrderFullResponse> {
  const response = await apiCall<spot.OrderACKResponseRaw | spot.OrderResultResponseRaw | spot.OrderFullResponseRaw>({
    host: 'spot',
    path: '/api/v3/order',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return spot.parseOrder(response);
}
