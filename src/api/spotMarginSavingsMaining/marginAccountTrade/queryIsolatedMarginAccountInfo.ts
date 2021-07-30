import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryIsolatedMarginAccountInfoPayload {}

export interface QueryIsolatedMarginAccountInfoResponse {
  coin: string;
}

interface QueryIsolatedMarginAccountInfoPayloadRaw {}

interface QueryIsolatedMarginAccountInfoResponseRaw {
  coin: string;
}

export async function queryIsolatedMarginAccountInfo(
  client: BinanceSignedClient,
  payload: QueryIsolatedMarginAccountInfoPayload,
) {
  const payloadRaw = parse<QueryIsolatedMarginAccountInfoPayload, QueryIsolatedMarginAccountInfoPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryIsolatedMarginAccountInfoResponseRaw>({
    host: 'spot',
    path: 'queryIsolatedMarginAccountInfo_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryIsolatedMarginAccountInfoResponseRaw, QueryIsolatedMarginAccountInfoResponse>(
    response,
    (data) => data,
  );
}
