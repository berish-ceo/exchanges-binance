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
import { coinM } from '../../../info';

export interface UserForceOrdersPayload {
  symbol?: string;
  autoCloseType?: coinM.AutoCloseType;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface UserForceOrdersResponse {
  orderId: number;
  symbol: string;
  pair: string;
  status: coinM.OrderStatus;
  clientOrderId: string;
  price: number;
  averagePrice: number;
  origQuantity: number;
  executedQuantity: number;
  cumBase: number;
  timeInForce: coinM.TimeInForce;
  type: coinM.OrderType;
  reduceOnly: boolean;
  closePosition: boolean;
  side: coinM.OrderSide;
  positionSide: coinM.PositionSide;
  stopPrice: number;
  workingType: coinM.WorkingType;
  priceProtect: boolean;
  origType: coinM.OrderType;
  time: Date;
  updateTime: Date;
}

interface UserForceOrdersPayloadRaw {
  symbol?: string;
  autoCloseType?: coinM.AutoCloseType;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface UserForceOrdersResponseRaw {
  orderId: number;
  symbol: string;
  pair: string;
  status: coinM.OrderStatus;
  clientOrderId: string;
  price: string;
  avgPrice: string;
  origQty: string;
  executedQty: string;
  cumBase: string;
  timeInForce: coinM.TimeInForce;
  type: coinM.OrderType;
  reduceOnly: boolean;
  closePosition: boolean;
  side: coinM.OrderSide;
  positionSide: coinM.PositionSide;
  stopPrice: string;
  workingType: coinM.WorkingType;
  priceProtect: boolean;
  origType: coinM.OrderType;
  time: number;
  updateTime: number;
}

export async function userForceOrders(client: BinanceSignedClient, payload?: UserForceOrdersPayload) {
  const payloadRaw = parse<UserForceOrdersPayload, UserForceOrdersPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<UserForceOrdersResponseRaw[]>({
    host: 'usdtM',
    path: '/dapi/v1/forceOrders',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<UserForceOrdersResponseRaw, UserForceOrdersResponse>(
    response,
    ({ price, avgPrice, origQty, executedQty, cumBase, stopPrice, time, updateTime, ...other }) => ({
      price: parse(price, numberParser),
      averagePrice: parse(avgPrice, numberParser),
      origQuantity: parse(origQty, numberParser),
      executedQuantity: parse(executedQty, numberParser),
      cumBase: parse(cumBase, numberParser),
      stopPrice: parse(stopPrice, numberParser),
      time: parse(time, dateParser),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
