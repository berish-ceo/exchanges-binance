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

export interface CurrentAllOpenOrdersPayload {
  symbol?: string;
  pair?: string;
}

export interface CurrentAllOpenOrdersResponse {
  averagePrice: number;
  clientOrderId: string;
  cumBase: number;
  executedQuantity: number;
  orderId: number;
  origQuantity: number;
  origType: usdtM.OrderType;
  price: number;
  reduceOnly: boolean;
  side: usdtM.OrderSide;
  positionSide: usdtM.PositionSide;
  status: usdtM.OrderStatus;
  stopPrice: number;
  closePosition: boolean;
  symbol: string;
  time: Date;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  activatePrice: number;
  priceRate: number;
  updateTime: Date;
  workingType: usdtM.WorkingType;
  priceProtect: boolean;
}

interface CurrentAllOpenOrdersResponseRaw {
  avgPrice: string;
  clientOrderId: string;
  cumBase: string;
  executedQty: string;
  orderId: number;
  origQty: string;
  origType: usdtM.OrderType;
  price: string;
  reduceOnly: boolean;
  side: usdtM.OrderSide;
  positionSide: usdtM.PositionSide;
  status: usdtM.OrderStatus;
  stopPrice: string;
  closePosition: boolean;
  symbol: string;
  time: number;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  activatePrice: string;
  priceRate: string;
  updateTime: number;
  workingType: usdtM.WorkingType;
  priceProtect: boolean;
}

export async function currentAllOpenOrders(client: BinanceSignedClient, payload?: CurrentAllOpenOrdersPayload) {
  const response = await apiCall<CurrentAllOpenOrdersResponseRaw[]>({
    host: 'usdtM',
    path: '/dapi/v1/openOrders',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parseArray<CurrentAllOpenOrdersResponseRaw, CurrentAllOpenOrdersResponse>(
    response,
    ({
      avgPrice,
      cumBase,
      executedQty,
      origQty,
      price,
      stopPrice,
      time,
      activatePrice,
      priceRate,
      updateTime,
      ...other
    }) => ({
      averagePrice: parse(avgPrice, numberParser),
      cumBase: parse(cumBase, numberParser),
      executedQuantity: parse(executedQty, numberParser),
      origQuantity: parse(origQty, numberParser),
      price: parse(price, numberParser),
      stopPrice: parse(stopPrice, numberParser),
      time: parse(time, dateParser),
      activatePrice: parse(activatePrice, numberParser),
      priceRate: parse(priceRate, numberParser),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
