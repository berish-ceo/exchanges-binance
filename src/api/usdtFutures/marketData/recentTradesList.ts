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
  quoteQuantity: number;
  time: Date;
  isBuyerMaker: boolean;
}

interface RecentTradesListResponseRaw {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
}

export async function recentTradesList(client: BinanceClient, payload: RecentTradesListPayload) {
  const response = await apiCall<RecentTradesListResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/trades',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payload,
  });

  return parseArray<RecentTradesListResponseRaw, RecentTradesListResponse>(
    response,
    ({ price, qty, quoteQty, time, ...other }) => ({
      price: parse(price, numberParser),
      quantity: parse(qty, numberParser),
      quoteQuantity: parse(quoteQty, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
