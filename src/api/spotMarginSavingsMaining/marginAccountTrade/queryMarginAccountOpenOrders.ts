import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMarginAccountOpenOrdersPayload {}

export interface QueryMarginAccountOpenOrdersResponse {
  coin: string;
}

interface QueryMarginAccountOpenOrdersPayloadRaw {}

interface QueryMarginAccountOpenOrdersResponseRaw {
  coin: string;
}

export async function queryMarginAccountOpenOrders(
  client: BinanceSignedClient,
  payload: QueryMarginAccountOpenOrdersPayload,
) {
  const payloadRaw = parse<QueryMarginAccountOpenOrdersPayload, QueryMarginAccountOpenOrdersPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryMarginAccountOpenOrdersResponseRaw>({
    host: 'spot',
    path: 'queryMarginAccountOpenOrders_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMarginAccountOpenOrdersResponseRaw, QueryMarginAccountOpenOrdersResponse>(response, (data) => data);
}
