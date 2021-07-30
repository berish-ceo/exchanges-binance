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

export interface OrderBookPayload {
  symbol: string;
  limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000;
}

export interface OrderBookResponse {
  lastUpdateId: number;
  symbol: string;
  pair: string;
  messageOutputTime: Date;
  transactionTime: Date;
  bids: { price: number; quantity: number }[];
  asks: { price: number; quantity: number }[];
}

interface OrderBookResponseRaw {
  lastUpdateId: number;
  symbol: string;
  pair: string;
  E: number;
  T: number;
  bids: [string, string][];
  asks: [string, string][];
}

export async function orderBook(client: BinanceClient, payload: OrderBookPayload) {
  const response = await apiCall<OrderBookResponseRaw>({
    host: 'spot',
    path: '/dapi/v1/depth',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payload,
  });

  return parse<OrderBookResponseRaw, OrderBookResponse>(response, ({ E, T, bids, asks, ...other }) => ({
    messageOutputTime: parse(E, dateParser),
    transactionTime: parse(T, dateParser),
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
