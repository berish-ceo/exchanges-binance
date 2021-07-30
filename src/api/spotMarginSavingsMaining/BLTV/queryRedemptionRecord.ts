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

export interface QueryRedemptionRecordPayload {
  tokenName?: string;
  id?: number;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface QueryRedemptionRecordResponse {
  id: number;
  tokenName: string;
  amount: number;
  nav: number;
  fee: number;
  netProceed: number;
  timestamp: Date;
}

interface QueryRedemptionRecordPayloadRaw {
  tokenName?: string;
  id?: number;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface QueryRedemptionRecordResponseRaw {
  id: number;
  tokenName: string;
  amount: string;
  nav: string;
  fee: string;
  netProceed: string;
  timestamp: number;
}

export async function queryRedemptionRecord(client: BinanceSignedClient, payload: QueryRedemptionRecordPayload) {
  const payloadRaw = parse<QueryRedemptionRecordPayload, QueryRedemptionRecordPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<QueryRedemptionRecordResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/blvt/redeem/record',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<QueryRedemptionRecordResponseRaw, QueryRedemptionRecordResponse>(
    response,
    ({ amount, nav, fee, netProceed, timestamp, ...other }) => ({
      amount: parse(amount, numberParser),
      nav: parse(nav, numberParser),
      fee: parse(fee, numberParser),
      netProceed: parse(netProceed, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
