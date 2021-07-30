import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryLoanRecordPayload {}

export interface QueryLoanRecordResponse {
  coin: string;
}

interface QueryLoanRecordPayloadRaw {}

interface QueryLoanRecordResponseRaw {
  coin: string;
}

export async function queryLoanRecord(client: BinanceSignedClient, payload: QueryLoanRecordPayload) {
  const payloadRaw = parse<QueryLoanRecordPayload, QueryLoanRecordPayloadRaw>(payload, (data) => data);

  const response = await apiCall<QueryLoanRecordResponseRaw>({
    host: 'spot',
    path: 'queryLoanRecord_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryLoanRecordResponseRaw, QueryLoanRecordResponse>(response, (data) => data);
}
