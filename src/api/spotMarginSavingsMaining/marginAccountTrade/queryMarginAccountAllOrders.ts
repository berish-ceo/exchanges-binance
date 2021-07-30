import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMarginAccountAllOrdersPayload {}

export interface QueryMarginAccountAllOrdersResponse {
  coin: string;
}

interface QueryMarginAccountAllOrdersPayloadRaw {}

interface QueryMarginAccountAllOrdersResponseRaw {
  coin: string;
}

export async function queryMarginAccountAllOrders(
  client: BinanceSignedClient,
  payload: QueryMarginAccountAllOrdersPayload,
) {
  const payloadRaw = parse<QueryMarginAccountAllOrdersPayload, QueryMarginAccountAllOrdersPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryMarginAccountAllOrdersResponseRaw>({
    host: 'spot',
    path: 'queryMarginAccountAllOrders_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMarginAccountAllOrdersResponseRaw, QueryMarginAccountAllOrdersResponse>(response, (data) => data);
}
