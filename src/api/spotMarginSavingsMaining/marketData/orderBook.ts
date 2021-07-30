import { BinanceClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface OrderBookPayload {
  symbol: string;
  limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000 | 5000;
}

export interface OrderBookResponse {
  lastUpdateId: number;
  bids: { price: number; quantity: number }[];
  asks: { price: number; quantity: number }[];
}

interface OrderBookResponseRaw {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export async function orderBook(client: BinanceClient, payload: OrderBookPayload) {
  const response = await apiCall<OrderBookResponseRaw>({
    host: 'spot',
    path: '/api/v3/depth',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payload,
  });

  return parse<OrderBookResponseRaw, OrderBookResponse>(response, ({ bids, asks, ...other }) => ({
    bids: parseArray(bids, ([price, quantity]) => ({
      price: parse(price, numberParser),
      quantity: parse(quantity, numberParser),
    })),
    asks: parseArray(asks, ([price, quantity]) => ({
      price: parse(price, numberParser),
      quantity: parse(quantity, numberParser),
    })),
    ...other,
  }));
}
