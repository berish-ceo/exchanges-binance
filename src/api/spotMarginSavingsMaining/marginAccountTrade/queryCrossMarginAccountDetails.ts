import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryCrossMarginAccountDetailsPayload {}

export interface QueryCrossMarginAccountDetailsResponse {
  coin: string;
}

interface QueryCrossMarginAccountDetailsPayloadRaw {}

interface QueryCrossMarginAccountDetailsResponseRaw {
  coin: string;
}

export async function queryCrossMarginAccountDetails(
  client: BinanceSignedClient,
  payload: QueryCrossMarginAccountDetailsPayload,
) {
  const payloadRaw = parse<QueryCrossMarginAccountDetailsPayload, QueryCrossMarginAccountDetailsPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryCrossMarginAccountDetailsResponseRaw>({
    host: 'spot',
    path: 'queryCrossMarginAccountDetails_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryCrossMarginAccountDetailsResponseRaw, QueryCrossMarginAccountDetailsResponse>(
    response,
    (data) => data,
  );
}
