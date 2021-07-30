import { BinanceKeyClient, BinanceSignedClient } from '../../../clients';
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

export interface OldTradesLookupPayload {
  symbol: string;
  limit?: number;
  fromId?: number;
}

export interface OldTradesLookupResponse {
  id: number;
  price: number;
  quantity: number;
  baseQuantity: number;
  time: Date;
  isBuyerMaker: boolean;
}

interface OldTradesLookupResponseRaw {
  id: number;
  price: string;
  qty: string;
  baseQty: string;
  time: number;
  isBuyerMaker: boolean;
}

export async function oldTradesLookup(client: BinanceKeyClient, payload: OldTradesLookupPayload) {
  const response = await apiCall<OldTradesLookupResponseRaw[]>({
    host: 'usdtM',
    path: '/dapi/v1/historicalTrades',
    method: 'GET',
    securityType: 'MARKET_DATA',

    client,
    data: payload,
  });

  return parseArray<OldTradesLookupResponseRaw, OldTradesLookupResponse>(
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
