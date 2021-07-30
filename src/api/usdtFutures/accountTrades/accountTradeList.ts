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
import { usdtM } from '../../../info';

export interface AccountTradeListPayload {
  symbol: string;
  startTime?: Date | number;
  endTime?: Date | number;
  fromId?: number;
  limit?: number;
}

export interface AccountTradeListResponse {
  buyer: boolean;
  commission: number;
  commissionAsset: string;
  id: number;
  maker: boolean;
  orderId: number;
  price: number;
  quantity: number;
  quoteQuantity: number;
  realizedPnl: number;
  side: usdtM.OrderSide;
  positionSide: usdtM.PositionSide;
  symbol: string;
  time: Date;
}

interface AccountTradeListPayloadRaw {
  symbol: string;
  startTime?: number;
  endTime?: number;
  fromId?: number;
  limit?: number;
}

interface AccountTradeListResponseRaw {
  buyer: boolean;
  commission: string;
  commissionAsset: string;
  id: number;
  maker: boolean;
  orderId: number;
  price: string;
  qty: string;
  quoteQty: string;
  realizedPnl: string;
  side: usdtM.OrderSide;
  positionSide: usdtM.PositionSide;
  symbol: string;
  time: number;
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
    host: 'usdtM',
    path: '/fapi/v1/userTrades',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<AccountTradeListResponseRaw, AccountTradeListResponse>(
    response,
    ({ commission, price, qty, quoteQty, realizedPnl, time, ...other }) => ({
      commission: parse(commission, numberParser),
      price: parse(price, numberParser),
      quantity: parse(qty, numberParser),
      quoteQuantity: parse(quoteQty, numberParser),
      realizedPnl: parse(realizedPnl, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
