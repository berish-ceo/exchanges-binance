import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetForceLiquidationRecordPayload {}

export interface GetForceLiquidationRecordResponse {
  coin: string;
}

interface GetForceLiquidationRecordPayloadRaw {}

interface GetForceLiquidationRecordResponseRaw {
  coin: string;
}

export async function getForceLiquidationRecord(
  client: BinanceSignedClient,
  payload: GetForceLiquidationRecordPayload,
) {
  const payloadRaw = parse<GetForceLiquidationRecordPayload, GetForceLiquidationRecordPayloadRaw>(
    payload,
    (data) => data,
  );

  const response = await apiCall<GetForceLiquidationRecordResponseRaw>({
    host: 'spot',
    path: 'getForceLiquidationRecord_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<GetForceLiquidationRecordResponseRaw, GetForceLiquidationRecordResponse>(response, (data) => data);
}
