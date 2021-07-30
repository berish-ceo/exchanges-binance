import { BinanceKeyClient } from '../../../clients';
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

export interface OldTradeLookupPayload {
  symbol: string;
  limit?: number;
  fromId?: number;
}

export interface OldTradeLookupResponse {
  id: number;
  price: number;
  quantity: number;
  quoteQuantity: number;
  time: Date;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

interface OldTradeLookupResponseRaw {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export async function oldTradeLookup(client: BinanceKeyClient, payload: OldTradeLookupPayload) {
  const response = await apiCall<OldTradeLookupResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/historicalTrades',
    method: 'GET',
    securityType: 'MARKET_DATA',

    client,
    data: payload,
  });

  return parseArray<OldTradeLookupResponseRaw, OldTradeLookupResponse>(
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
