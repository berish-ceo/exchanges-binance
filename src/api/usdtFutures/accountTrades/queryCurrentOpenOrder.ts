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

export type QueryCurrentOpenOrderPayload = {
  symbol: string;
} & ({ orderId: number } | { origClientOrderId: string });

export interface QueryCurrentOpenOrderResponse {
  averagePrice: number;
  clientOrderId: string;
  cumQuote: number;
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

interface QueryCurrentOpenOrderResponseRaw {
  avgPrice: string;
  clientOrderId: string;
  cumQuote: string;
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

export async function queryCurrentOpenOrder(client: BinanceSignedClient, payload: QueryCurrentOpenOrderPayload) {
  const response = await apiCall<QueryCurrentOpenOrderResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/openOrder',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<QueryCurrentOpenOrderResponseRaw, QueryCurrentOpenOrderResponse>(
    response,
    ({
      avgPrice,
      cumQuote,
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
      cumQuote: parse(cumQuote, numberParser),
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
