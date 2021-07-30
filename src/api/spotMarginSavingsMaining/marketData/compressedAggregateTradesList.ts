import { BinanceClient } from '../../../clients';
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

export interface CompressedAggregateTradesListPayload {
  symbol: string;
  fromId?: number;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface CompressedAggregateTradesListResponse {
  aggregateTradeId: number;
  price: number;
  quantity: number;
  firstTradeId: number;
  lastTradeId: number;
  timestamp: Date;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

interface CompressedAggregateTradesListPayloadRaw {
  symbol: string;
  fromId?: number;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface CompressedAggregateTradesListResponseRaw {
  a: number;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
  M: boolean;
}

export async function compressedAggregateTradesList(
  client: BinanceClient,
  payload: CompressedAggregateTradesListPayload,
) {
  const payloadRaw = parse<CompressedAggregateTradesListPayload, CompressedAggregateTradesListPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<CompressedAggregateTradesListResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/aggTrades',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<CompressedAggregateTradesListResponseRaw, CompressedAggregateTradesListResponse>(
    response,
    ({ a, p, q, f, l, T, m, M, ...other }) => ({
      aggregateTradeId: a,
      price: parse(p, numberParser),
      quantity: parse(q, numberParser),
      firstTradeId: f,
      lastTradeId: l,
      timestamp: parse(T, dateParser),
      isBuyerMaker: m,
      isBestMatch: M,
      ...other,
    }),
  );
}
