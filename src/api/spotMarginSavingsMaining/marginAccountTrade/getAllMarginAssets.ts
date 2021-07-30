import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetAllMarginAssetsPayload {}

export interface GetAllMarginAssetsResponse {
  coin: string;
}

interface GetAllMarginAssetsPayloadRaw {}

interface GetAllMarginAssetsResponseRaw {
  coin: string;
}

export async function getAllMarginAssets(client: BinanceSignedClient, payload: GetAllMarginAssetsPayload) {
  const payloadRaw = parse<GetAllMarginAssetsPayload, GetAllMarginAssetsPayloadRaw>(payload, (data) => data);

  const response = await apiCall<GetAllMarginAssetsResponseRaw>({
    host: 'spot',
    path: 'getAllMarginAssets_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetAllMarginAssetsResponseRaw, GetAllMarginAssetsResponse>(response, (data) => data);
}
