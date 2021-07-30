import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetAllCrossMarginPairsPayload {}

export interface GetAllCrossMarginPairsResponse {
  coin: string;
}

interface GetAllCrossMarginPairsPayloadRaw {}

interface GetAllCrossMarginPairsResponseRaw {
  coin: string;
}

export async function getAllCrossMarginPairs(client: BinanceSignedClient, payload: GetAllCrossMarginPairsPayload) {
  const payloadRaw = parse<GetAllCrossMarginPairsPayload, GetAllCrossMarginPairsPayloadRaw>(payload, (data) => data);

  const response = await apiCall<GetAllCrossMarginPairsResponseRaw>({
    host: 'spot',
    path: 'getAllCrossMarginPairs_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetAllCrossMarginPairsResponseRaw, GetAllCrossMarginPairsResponse>(response, (data) => data);
}
