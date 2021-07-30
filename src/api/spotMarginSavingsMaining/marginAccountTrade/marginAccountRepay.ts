import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface MarginAccountRepayPayload {}

export interface MarginAccountRepayResponse {
  coin: string;
}

interface MarginAccountRepayPayloadRaw {}

interface MarginAccountRepayResponseRaw {
  coin: string;
}

export async function marginAccountRepay(client: BinanceSignedClient, payload: MarginAccountRepayPayload) {
  const payloadRaw = parse<MarginAccountRepayPayload, MarginAccountRepayPayloadRaw>(payload, (data) => data);

  const response = await apiCall<MarginAccountRepayResponseRaw>({
    host: 'spot',
    path: 'marginAccountRepay_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<MarginAccountRepayResponseRaw, MarginAccountRepayResponse>(response, (data) => data);
}
