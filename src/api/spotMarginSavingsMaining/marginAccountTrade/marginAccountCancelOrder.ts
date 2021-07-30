import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface MarginAccountCancelOrderPayload {}

export interface MarginAccountCancelOrderResponse {
  coin: string;
}

interface MarginAccountCancelOrderPayloadRaw {}

interface MarginAccountCancelOrderResponseRaw {
  coin: string;
}

export async function marginAccountCancelOrder(client: BinanceSignedClient, payload: MarginAccountCancelOrderPayload) {
  const payloadRaw = parse<MarginAccountCancelOrderPayload, MarginAccountCancelOrderPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<MarginAccountCancelOrderResponseRaw>({
    host: 'spot',
    path: 'marginAccountCancelOrder_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<MarginAccountCancelOrderResponseRaw, MarginAccountCancelOrderResponse>(response, (data) => data);
}
