import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QueryMaxBorrowPayload {}

export interface QueryMaxBorrowResponse {
  coin: string;
}

interface QueryMaxBorrowPayloadRaw {}

interface QueryMaxBorrowResponseRaw {
  coin: string;
}

export async function queryMaxBorrow(client: BinanceSignedClient, payload: QueryMaxBorrowPayload) {
  const payloadRaw = parse<QueryMaxBorrowPayload, QueryMaxBorrowPayloadRaw>(payload, (data) => data);

  const response = await apiCall<QueryMaxBorrowResponseRaw>({
    host: 'spot',
    path: 'queryMaxBorrow_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<QueryMaxBorrowResponseRaw, QueryMaxBorrowResponse>(response, (data) => data);
}
