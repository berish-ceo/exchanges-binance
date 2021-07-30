import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CrossMarginAccountTransferPayload {}

export interface CrossMarginAccountTransferResponse {
  coin: string;
}

interface CrossMarginAccountTransferPayloadRaw {}

interface CrossMarginAccountTransferResponseRaw {
  coin: string;
}

export async function crossMarginAccountTransfer(
  client: BinanceSignedClient,
  payload: CrossMarginAccountTransferPayload,
) {
  const payloadRaw = parse<CrossMarginAccountTransferPayload, CrossMarginAccountTransferPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<CrossMarginAccountTransferResponseRaw>({
    host: 'spot',
    path: 'crossMarginAccountTransfer_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<CrossMarginAccountTransferResponseRaw, CrossMarginAccountTransferResponse>(response, (data) => data);
}
