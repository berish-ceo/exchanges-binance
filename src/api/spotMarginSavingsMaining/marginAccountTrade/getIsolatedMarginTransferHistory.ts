import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetIsolatedMarginTransferHistoryPayload {}

export interface GetIsolatedMarginTransferHistoryResponse {
  coin: string;
}

interface GetIsolatedMarginTransferHistoryPayloadRaw {}

interface GetIsolatedMarginTransferHistoryResponseRaw {
  coin: string;
}

export async function getIsolatedMarginTransferHistory(
  client: BinanceSignedClient,
  payload: GetIsolatedMarginTransferHistoryPayload,
) {
  const payloadRaw = parse<GetIsolatedMarginTransferHistoryPayload, GetIsolatedMarginTransferHistoryPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<GetIsolatedMarginTransferHistoryResponseRaw>({
    host: 'spot',
    path: 'getIsolatedMarginTransferHistory_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetIsolatedMarginTransferHistoryResponseRaw, GetIsolatedMarginTransferHistoryResponse>(
    response,
    (data) => data,
  );
}
