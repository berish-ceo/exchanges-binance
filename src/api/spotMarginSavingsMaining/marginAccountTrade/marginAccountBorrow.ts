import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface MarginAccountBorrowPayload {}

export interface MarginAccountBorrowResponse {
  coin: string;
}

interface MarginAccountBorrowPayloadRaw {}

interface MarginAccountBorrowResponseRaw {
  coin: string;
}

export async function marginAccountBorrow(client: BinanceSignedClient, payload: MarginAccountBorrowPayload) {
  const payloadRaw = parse<MarginAccountBorrowPayload, MarginAccountBorrowPayloadRaw>(payload, (data) => data);

  const response = await apiCall<MarginAccountBorrowResponseRaw>({
    host: 'spot',
    path: 'marginAccountBorrow_path',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<MarginAccountBorrowResponseRaw, MarginAccountBorrowResponse>(response, (data) => data);
}
