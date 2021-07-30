import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CreateIsolatedMarginAccountPayload {}

export interface CreateIsolatedMarginAccountResponse {
  coin: string;
}

interface CreateIsolatedMarginAccountPayloadRaw {}

interface CreateIsolatedMarginAccountResponseRaw {
  coin: string;
}

export async function createIsolatedMarginAccount(
  client: BinanceSignedClient,
  payload: CreateIsolatedMarginAccountPayload,
) {
  const payloadRaw = parse<CreateIsolatedMarginAccountPayload, CreateIsolatedMarginAccountPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<CreateIsolatedMarginAccountResponseRaw>({
    host: 'spot',
    path: 'createIsolatedMarginAccount_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<CreateIsolatedMarginAccountResponseRaw, CreateIsolatedMarginAccountResponse>(response, (data) => data);
}
