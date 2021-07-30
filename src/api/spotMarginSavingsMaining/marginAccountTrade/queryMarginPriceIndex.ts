import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMarginPriceIndexPayload {}

export interface QueryMarginPriceIndexResponse {
  coin: string;
}

interface QueryMarginPriceIndexPayloadRaw {}

interface QueryMarginPriceIndexResponseRaw {
  coin: string;
}

export async function queryMarginPriceIndex(client: BinanceSignedClient, payload: QueryMarginPriceIndexPayload) {
  const payloadRaw = parse<QueryMarginPriceIndexPayload, QueryMarginPriceIndexPayloadRaw>(payload, (data) => data);

  const response = await apiCall<QueryMarginPriceIndexResponseRaw>({
    host: 'spot',
    path: 'queryMarginPriceIndex_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMarginPriceIndexResponseRaw, QueryMarginPriceIndexResponse>(response, (data) => data);
}
