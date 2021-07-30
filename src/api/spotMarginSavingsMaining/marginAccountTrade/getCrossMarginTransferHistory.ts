import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetCrossMarginTransferHistoryPayload {}

export interface GetCrossMarginTransferHistoryResponse {
  coin: string;
}

interface GetCrossMarginTransferHistoryPayloadRaw {}

interface GetCrossMarginTransferHistoryResponseRaw {
  coin: string;
}

export async function getCrossMarginTransferHistory(
  client: BinanceSignedClient,
  payload: GetCrossMarginTransferHistoryPayload,
) {
  const payloadRaw = parse<GetCrossMarginTransferHistoryPayload, GetCrossMarginTransferHistoryPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<GetCrossMarginTransferHistoryResponseRaw>({
    host: 'spot',
    path: 'getCrossMarginTransferHistory_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetCrossMarginTransferHistoryResponseRaw, GetCrossMarginTransferHistoryResponse>(
    response,
    (data) => data,
  );
}
