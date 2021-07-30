import { BinanceClient, BinanceSignedClient } from '../../../clients';
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

export interface RecentTradesListPayload {
  symbol: string;
  limit?: number;
}

export interface RecentTradesListResponse {
  id: number;
  price: number;
  quantity: number;
  baseQuantity: number;
  time: Date;
  isBuyerMaker: boolean;
}

interface RecentTradesListResponseRaw {
  id: number;
  price: string;
  qty: string;
  baseQty: string;
  time: number;
  isBuyerMaker: boolean;
}

export async function recentTradesList(client: BinanceClient, payload: RecentTradesListPayload) {
  const response = await apiCall<RecentTradesListResponseRaw[]>({
    host: 'usdtM',
    path: '/dapi/v1/trades',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payload,
  });

  return parseArray<RecentTradesListResponseRaw, RecentTradesListResponse>(
    response,
    ({ price, qty, baseQty, time, ...other }) => ({
      price: parse(price, numberParser),
      quantity: parse(qty, numberParser),
      baseQuantity: parse(baseQty, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
