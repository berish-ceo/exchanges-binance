import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetAllIsolatedMarginSymbolPayload {}

export interface GetAllIsolatedMarginSymbolResponse {
  coin: string;
}

interface GetAllIsolatedMarginSymbolPayloadRaw {}

interface GetAllIsolatedMarginSymbolResponseRaw {
  coin: string;
}

export async function getAllIsolatedMarginSymbol(
  client: BinanceSignedClient,
  payload: GetAllIsolatedMarginSymbolPayload,
) {
  const payloadRaw = parse<GetAllIsolatedMarginSymbolPayload, GetAllIsolatedMarginSymbolPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<GetAllIsolatedMarginSymbolResponseRaw>({
    host: 'spot',
    path: 'getAllIsolatedMarginSymbol_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetAllIsolatedMarginSymbolResponseRaw, GetAllIsolatedMarginSymbolResponse>(response, (data) => data);
}
