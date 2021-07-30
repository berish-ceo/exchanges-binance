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

export type CancelOrderPayload = {
  symbol: string;
} & ({ orderId: number } | { origClientOrderId: string });

export interface CancelOrderResponse {
  averagePrice: number;
  clientOrderId: string;
  cumQuantity: number;
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
  pair: string;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  activatePrice: number;
  priceRate: number;
  updateTime: Date;
  workingType: usdtM.WorkingType;
  priceProtect: boolean;
}

interface CancelOrderResponseRaw {
  avgPrice: string;
  clientOrderId: string;
  cumQty: string;
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
  pair: string;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  activatePrice: string;
  priceRate: string;
  updateTime: number;
  workingType: usdtM.WorkingType;
  priceProtect: boolean;
}

export async function cancelOrder(client: BinanceSignedClient, payload: CancelOrderPayload) {
  const response = await apiCall<CancelOrderResponseRaw>({
    host: 'usdtM',
    path: '/dapi/v1/order',
    method: 'DELETE',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return parse<CancelOrderResponseRaw, CancelOrderResponse>(
    response,
    ({
      avgPrice,
      cumQty,
      cumBase,
      executedQty,
      origQty,
      price,
      stopPrice,
      activatePrice,
      priceRate,
      updateTime,
      ...other
    }) => ({
      averagePrice: parse(avgPrice, numberParser),
      cumQuantity: parse(cumQty, numberParser),
      cumBase: parse(cumBase, numberParser),
      executedQuantity: parse(executedQty, numberParser),
      origQuantity: parse(origQty, numberParser),
      price: parse(price, numberParser),
      stopPrice: parse(stopPrice, numberParser),
      activatePrice: parse(activatePrice, numberParser),
      priceRate: parse(priceRate, numberParser),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
