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

export interface UserForceOrdersPayload {
  symbol?: string;
  autoCloseType?: usdtM.AutoCloseType;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface UserForceOrdersResponse {
  orderId: number;
  symbol: string;
  status: usdtM.OrderStatus;
  clientOrderId: string;
  price: number;
  averagePrice: number;
  origQuantity: number;
  executedQuantity: number;
  cumQuote: number;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  reduceOnly: boolean;
  closePosition: boolean;
  side: usdtM.OrderSide;
  positionSide: usdtM.PositionSide;
  stopPrice: number;
  workingType: usdtM.WorkingType;
  origType: usdtM.OrderType;
  time: Date;
  updateTime: Date;
}

interface UserForceOrdersPayloadRaw {
  symbol?: string;
  autoCloseType?: usdtM.AutoCloseType;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface UserForceOrdersResponseRaw {
  orderId: number;
  symbol: string;
  status: usdtM.OrderStatus;
  clientOrderId: string;
  price: string;
  avgPrice: string;
  origQty: string;
  executedQty: string;
  cumQuote: string;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  reduceOnly: boolean;
  closePosition: boolean;
  side: usdtM.OrderSide;
  positionSide: usdtM.PositionSide;
  stopPrice: string;
  workingType: usdtM.WorkingType;
  origType: usdtM.OrderType;
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
    path: '/fapi/v1/forceOrders',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<UserForceOrdersResponseRaw, UserForceOrdersResponse>(
    response,
    ({ price, avgPrice, origQty, executedQty, cumQuote, stopPrice, time, updateTime, ...other }) => ({
      price: parse(price, numberParser),
      averagePrice: parse(avgPrice, numberParser),
      origQuantity: parse(origQty, numberParser),
      executedQuantity: parse(executedQty, numberParser),
      cumQuote: parse(cumQuote, numberParser),
      stopPrice: parse(stopPrice, numberParser),
      time: parse(time, dateParser),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
