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

export type NewOCOPayload<OrderResponseType extends spot.OrderResponseType = spot.OrderResponseType> =
  spot.NewOCOPayload<OrderResponseType>;

export async function newOCO(
  client: BinanceSignedClient,
  payload: spot.NewOCOPayload<'FULL'>,
): Promise<spot.OrderOCOFullResponse>;
export async function newOCO(
  client: BinanceSignedClient,
  payload: spot.NewOCOPayload<'RESULT'>,
): Promise<spot.OrderOCOResultResponse>;
export async function newOCO(
  client: BinanceSignedClient,
  payload: spot.NewOCOPayload<'ACK'>,
): Promise<spot.OrderOCOACKResponse>;
export async function newOCO(
  client: BinanceSignedClient,
  payload: spot.NewOCOPayload<spot.OrderResponseType>,
): Promise<spot.OrderOCOFullResponse> {
  const response = await apiCall<
    spot.OrderOCOACKResponseRaw | spot.OrderOCOResultResponseRaw | spot.OrderOCOFullResponseRaw
  >({
    host: 'spot',
    path: '/api/v3/order/oco',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return spot.parseOrderOCO(response);
}
