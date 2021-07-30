import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface MarginAccountCancelAllOpenOrdersOnSymbolPayload {}

export interface MarginAccountCancelAllOpenOrdersOnSymbolResponse {
  coin: string;
}

interface MarginAccountCancelAllOpenOrdersOnSymbolPayloadRaw {}

interface MarginAccountCancelAllOpenOrdersOnSymbolResponseRaw {
  coin: string;
}

export async function marginAccountCancelAllOpenOrdersOnSymbol(
  client: BinanceSignedClient,
  payload: MarginAccountCancelAllOpenOrdersOnSymbolPayload,
) {
  const payloadRaw = parse<
    MarginAccountCancelAllOpenOrdersOnSymbolPayload,
    MarginAccountCancelAllOpenOrdersOnSymbolPayloadRaw
  >(payload, (data) => data);

  const response = await apiCall<MarginAccountCancelAllOpenOrdersOnSymbolResponseRaw>({
    host: 'spot',
    path: 'marginAccountCancelAllOpenOrdersOnSymbol_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<MarginAccountCancelAllOpenOrdersOnSymbolResponseRaw, MarginAccountCancelAllOpenOrdersOnSymbolResponse>(
    response,
    (data) => data,
  );
}
