import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryCrossMarginPairPayload {}

export interface QueryCrossMarginPairResponse {
  coin: string;
}

interface QueryCrossMarginPairPayloadRaw {}

interface QueryCrossMarginPairResponseRaw {
  coin: string;
}

export async function queryCrossMarginPair(client: BinanceSignedClient, payload: QueryCrossMarginPairPayload) {
  const payloadRaw = parse<QueryCrossMarginPairPayload, QueryCrossMarginPairPayloadRaw>(payload, (data) => data);

  const response = await apiCall<QueryCrossMarginPairResponseRaw>({
    host: 'spot',
    path: 'queryCrossMarginPair_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryCrossMarginPairResponseRaw, QueryCrossMarginPairResponse>(response, (data) => data);
}
