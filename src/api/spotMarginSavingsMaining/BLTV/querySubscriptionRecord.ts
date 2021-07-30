import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  dateParser,
} from '@berish/safe-parsing';

export interface QuerySubscriptionRecordPayload {
  tokenName?: string;
  id?: number;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface QuerySubscriptionRecordResponse {
  id: number;
  tokenName: string;
  amount: number;
  nav: number;
  fee: number;
  totalCharge: number;
  timestamp: Date;
}

interface QuerySubscriptionRecordPayloadRaw {
  tokenName?: string;
  id?: number;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface QuerySubscriptionRecordResponseRaw {
  id: number;
  tokenName: string;
  amount: string;
  nav: string;
  fee: string;
  totalCharge: string;
  timestamp: number;
}

export async function querySubscriptionRecord(client: BinanceSignedClient, payload: QuerySubscriptionRecordPayload) {
  const payloadRaw = parse<QuerySubscriptionRecordPayload, QuerySubscriptionRecordPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<QuerySubscriptionRecordResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/blvt/subscribe/record',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<QuerySubscriptionRecordResponseRaw, QuerySubscriptionRecordResponse>(
    response,
    ({ amount, nav, fee, totalCharge, timestamp, ...other }) => ({
      amount: parse(amount, numberParser),
      nav: parse(nav, numberParser),
      fee: parse(fee, numberParser),
      totalCharge: parse(totalCharge, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
