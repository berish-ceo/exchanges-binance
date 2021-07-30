import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { NewOrderPayload } from './newOrder';

export type TestNewOrderPayload = NewOrderPayload;

export async function testNewOrder(client: BinanceSignedClient, payload: TestNewOrderPayload) {
  await apiCall<{}>({
    host: 'spot',
    path: '/api/v3/order/test',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });
}
