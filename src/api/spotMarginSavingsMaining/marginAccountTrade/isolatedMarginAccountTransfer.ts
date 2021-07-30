import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface IsolatedMarginAccountTransferPayload {}

export interface IsolatedMarginAccountTransferResponse {
  coin: string;
}

interface IsolatedMarginAccountTransferPayloadRaw {}

interface IsolatedMarginAccountTransferResponseRaw {
  coin: string;
}

export async function isolatedMarginAccountTransfer(
  client: BinanceSignedClient,
  payload: IsolatedMarginAccountTransferPayload,
) {
  const payloadRaw = parse<IsolatedMarginAccountTransferPayload, IsolatedMarginAccountTransferPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<IsolatedMarginAccountTransferResponseRaw>({
    host: 'spot',
    path: 'isolatedMarginAccountTransfer_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<IsolatedMarginAccountTransferResponseRaw, IsolatedMarginAccountTransferResponse>(
    response,
    (data) => data,
  );
}
