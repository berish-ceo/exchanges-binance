import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface MarginAccountNewOrderPayload {}

export interface MarginAccountNewOrderResponse {
  coin: string;
}

interface MarginAccountNewOrderPayloadRaw {}

interface MarginAccountNewOrderResponseRaw {
  coin: string;
}

export async function marginAccountNewOrder(client: BinanceSignedClient, payload: MarginAccountNewOrderPayload) {
  const payloadRaw = parse<MarginAccountNewOrderPayload, MarginAccountNewOrderPayloadRaw>(payload, (data) => data);

  const response = await apiCall<MarginAccountNewOrderResponseRaw>({
    host: 'spot',
    path: 'marginAccountNewOrder_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<MarginAccountNewOrderResponseRaw, MarginAccountNewOrderResponse>(response, (data) => data);
}
