import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryIsolatedMarginSymbolPayload {}

export interface QueryIsolatedMarginSymbolResponse {
  coin: string;
}

interface QueryIsolatedMarginSymbolPayloadRaw {}

interface QueryIsolatedMarginSymbolResponseRaw {
  coin: string;
}

export async function queryIsolatedMarginSymbol(
  client: BinanceSignedClient,
  payload: QueryIsolatedMarginSymbolPayload,
) {
  const payloadRaw = parse<QueryIsolatedMarginSymbolPayload, QueryIsolatedMarginSymbolPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryIsolatedMarginSymbolResponseRaw>({
    host: 'spot',
    path: 'queryIsolatedMarginSymbol_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryIsolatedMarginSymbolResponseRaw, QueryIsolatedMarginSymbolResponse>(response, (data) => data);
}
