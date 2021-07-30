import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMarginAssetPayload {}

export interface QueryMarginAssetResponse {
  coin: string;
}

interface QueryMarginAssetPayloadRaw {}

interface QueryMarginAssetResponseRaw {
  coin: string;
}

export async function queryMarginAsset(client: BinanceSignedClient, payload: QueryMarginAssetPayload) {
  const payloadRaw = parse<QueryMarginAssetPayload, QueryMarginAssetPayloadRaw>(payload, (data) => data);

  const response = await apiCall<QueryMarginAssetResponseRaw>({
    host: 'spot',
    path: 'queryMarginAsset_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMarginAssetResponseRaw, QueryMarginAssetResponse>(response, (data) => data);
}
