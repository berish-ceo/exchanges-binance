import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMarginAccountOrderPayload {}

export interface QueryMarginAccountOrderResponse {
  coin: string;
}

interface QueryMarginAccountOrderPayloadRaw {}

interface QueryMarginAccountOrderResponseRaw {
  coin: string;
}

export async function queryMarginAccountOrder(client: BinanceSignedClient, payload: QueryMarginAccountOrderPayload) {
  const payloadRaw = parse<QueryMarginAccountOrderPayload, QueryMarginAccountOrderPayloadRaw>(payload, (data) => data);

  const response = await apiCall<QueryMarginAccountOrderResponseRaw>({
    host: 'spot',
    path: 'queryMarginAccountOrder_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMarginAccountOrderResponseRaw, QueryMarginAccountOrderResponse>(response, (data) => data);
}
