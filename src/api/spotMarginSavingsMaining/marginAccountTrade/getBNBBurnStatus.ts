import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetBNBBurnStatusPayload {}

export interface GetBNBBurnStatusResponse {
  coin: string;
}

interface GetBNBBurnStatusPayloadRaw {}

interface GetBNBBurnStatusResponseRaw {
  coin: string;
}

export async function getBNBBurnStatus(client: BinanceSignedClient, payload: GetBNBBurnStatusPayload) {
  const payloadRaw = parse<GetBNBBurnStatusPayload, GetBNBBurnStatusPayloadRaw>(payload, (data) => data);

  const response = await apiCall<GetBNBBurnStatusResponseRaw>({
    host: 'spot',
    path: 'getBNBBurnStatus_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetBNBBurnStatusResponseRaw, GetBNBBurnStatusResponse>(response, (data) => data);
}
