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

export type AccountTradeListPayload = ({ symbol: string } | { pair: string }) & {
  startTime?: Date | number;
  endTime?: Date | number;
  fromId?: number;
  limit?: number;
};

export interface AccountTradeListResponse {
  symbol: string;
  id: number;
  orderId: number;
  pair: string;
  side: usdtM.OrderSide;
  price: number;
  quantity: number;
  realizedPnl: number;
  marginAsset: string;
  baseQuantity: number;
  commission: number;
  commissionAsset: string;
  time: Date;
  positionSide: usdtM.PositionSide;
  buyer: boolean;
  maker: boolean;
}

type AccountTradeListPayloadRaw = ({ symbol: string } | { pair: string }) & {
  startTime?: number;
  endTime?: number;
  fromId?: number;
  limit?: number;
};

interface AccountTradeListResponseRaw {
  symbol: string;
  id: number;
  orderId: number;
  pair: string;
  side: usdtM.OrderSide;
  price: string;
  qty: string;
  realizedPnl: string;
  marginAsset: string;
  baseQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  positionSide: usdtM.PositionSide;
  buyer: boolean;
  maker: boolean;
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
    path: '/dapi/v1/userTrades',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<AccountTradeListResponseRaw, AccountTradeListResponse>(
    response,
    ({ price, qty, realizedPnl, baseQty, commission, time, ...other }) => ({
      price: parse(price, numberParser),
      quantity: parse(qty, numberParser),
      realizedPnl: parse(realizedPnl, numberParser),
      baseQuantity: parse(baseQty, numberParser),
      commission: parse(commission, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
