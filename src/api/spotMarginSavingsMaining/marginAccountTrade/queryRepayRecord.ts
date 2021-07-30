import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryRepayRecordPayload {}

export interface QueryRepayRecordResponse {
  coin: string;
}

interface QueryRepayRecordPayloadRaw {}

interface QueryRepayRecordResponseRaw {
  coin: string;
}

export async function queryRepayRecord(client: BinanceSignedClient, payload: QueryRepayRecordPayload) {
  const payloadRaw = parse<QueryRepayRecordPayload, QueryRepayRecordPayloadRaw>(payload, (data) => data);

  const response = await apiCall<QueryRepayRecordResponseRaw>({
    host: 'spot',
    path: 'queryRepayRecord_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryRepayRecordResponseRaw, QueryRepayRecordResponse>(response, (data) => data);
}
