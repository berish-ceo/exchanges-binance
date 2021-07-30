import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetInterestHistoryPayload {}

export interface GetInterestHistoryResponse {
  coin: string;
}

interface GetInterestHistoryPayloadRaw {}

interface GetInterestHistoryResponseRaw {
  coin: string;
}

export async function getInterestHistory(client: BinanceSignedClient, payload: GetInterestHistoryPayload) {
  const payloadRaw = parse<GetInterestHistoryPayload, GetInterestHistoryPayloadRaw>(payload, (data) => data);

  const response = await apiCall<GetInterestHistoryResponseRaw>({
    host: 'spot',
    path: 'getInterestHistory_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetInterestHistoryResponseRaw, GetInterestHistoryResponse>(response, (data) => data);
}
