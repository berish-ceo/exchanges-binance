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

export interface AccountTradeListPayload {
  symbol: string;
  startTime?: Date | number;
  endTime?: Date | number;
  fromId?: number;
  limit?: number;
}

export interface AccountTradeListResponse {
  symbol: string;
  id: number;
  orderId: number;
  orderListId: number;
  price: number;
  quantity: number;
  quoteQuantity: number;
  commission: number;
  commissionAsset: string;
  time: Date;
  isBuyer: boolean;
  isMaker: boolean;
  isBestMatch: boolean;
}

interface AccountTradeListPayloadRaw {
  symbol: string;
  startTime?: number;
  endTime?: number;
  fromId?: number;
  limit?: number;
}

interface AccountTradeListResponseRaw {
  symbol: string;
  id: number;
  orderId: number;
  orderListId: number;
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
  isBestMatch: boolean;
}

export async function accountTradeList(client: BinanceSignedClient, payload: AccountTradeListPayload) {
  const payloadRaw = parse<AccountTradeListPayload, AccountTradeListPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<AccountTradeListResponseRaw[]>({
    host: 'spot',
    path: '/api/v3/myTrades',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<AccountTradeListResponseRaw, AccountTradeListResponse>(
    response,
    ({ price, qty, quoteQty, commission, time, ...other }) => ({
      price: parse(price, numberParser),
      quantity: parse(qty, numberParser),
      quoteQuantity: parse(quoteQty, numberParser),
      commission: parse(commission, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
