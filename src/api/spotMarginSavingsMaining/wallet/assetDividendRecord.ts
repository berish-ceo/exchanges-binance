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

export interface AssetDividendRecordPayload {
  asset?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface AssetDividendRecordResponse {
  rows: {
    amount: number;
    asset: string;
    divTime: Date;
    enInfo: string;
    tranId: number;
  }[];
  total: number;
}

interface AssetDividendRecordPayloadRaw {
  asset?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface AssetDividendRecordResponseRaw {
  rows: {
    amount: string;
    asset: string;
    divTime: number;
    enInfo: string;
    tranId: number;
  }[];
  total: number;
}

export async function assetDividendRecord(client: BinanceSignedClient, payload?: AssetDividendRecordPayload) {
  const payloadRaw = parse<AssetDividendRecordPayload, AssetDividendRecordPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<AssetDividendRecordResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/asset/assetDividend',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<AssetDividendRecordResponseRaw, AssetDividendRecordResponse>(response, ({ rows, ...other }) => ({
    rows: parseArray(rows, ({ amount, divTime, ...other }) => ({
      amount: parse(amount, numberParser),
      divTime: parse(divTime, dateParser),
      ...other,
    })),
    ...other,
  }));
}
