import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMaxTransferOutAmountPayload {}

export interface QueryMaxTransferOutAmountResponse {
  coin: string;
}

interface QueryMaxTransferOutAmountPayloadRaw {}

interface QueryMaxTransferOutAmountResponseRaw {
  coin: string;
}

export async function queryMaxTransferOutAmount(
  client: BinanceSignedClient,
  payload: QueryMaxTransferOutAmountPayload,
) {
  const payloadRaw = parse<QueryMaxTransferOutAmountPayload, QueryMaxTransferOutAmountPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<QueryMaxTransferOutAmountResponseRaw>({
    host: 'spot',
    path: 'queryMaxTransferOutAmount_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMaxTransferOutAmountResponseRaw, QueryMaxTransferOutAmountResponse>(response, (data) => data);
}
