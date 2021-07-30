import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CancelMultipleOrdersPayload {}

export interface CancelMultipleOrdersResponse {
  coin: string;
}

interface CancelMultipleOrdersPayloadRaw {}

interface CancelMultipleOrdersResponseRaw {
  coin: string;
}

export async function cancelMultipleOrders(client: BinanceSignedClient, payload: CancelMultipleOrdersPayload) {
  const payloadRaw = parse<CancelMultipleOrdersPayload, CancelMultipleOrdersPayloadRaw>(payload, (data) => data);

  const response = await apiCall<CancelMultipleOrdersResponseRaw>({
    host: 'usdtM',
    path: 'cancelMultipleOrders_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<CancelMultipleOrdersResponseRaw, CancelMultipleOrdersResponse>(response, (data) => data);
}
