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
import { RefType, usdtM } from '../../../info';

export type NewOrderPayload<ResponseType extends usdtM.ResponseType = usdtM.ResponseType> = {
  symbol: string;
  side: usdtM.OrderSide;
} & (
  | {
      type: RefType<usdtM.OrderType, 'LIMIT'>;
      timeInForce: usdtM.TimeInForce;
      quantity: number;
      price: number;
    }
  | { type: RefType<usdtM.OrderType, 'MARKET'>; quantity: number }
  | { type: RefType<usdtM.OrderType, 'TRAILING_STOP_MARKET'>; callbackRate: number; activationPrice?: number }
  | ({ stopPrice: number; priceProtect?: boolean } & (
      | { type: RefType<usdtM.OrderType, 'STOP' | 'TAKE_PROFIT'>; quantity: number; price: number }
      | { type: RefType<usdtM.OrderType, 'STOP_MARKET' | 'TAKE_PROFIT_MARKET'>; closePosition?: boolean }
    ))
) & {
    positionSide?: usdtM.PositionSide;

    timeInForce?: usdtM.TimeInForce;
    quantity?: number;
    reduceOnly?: boolean;
    price?: number;
    newClientOrderId?: string;
    workType?: usdtM.WorkingType;
    newOrderRespType: ResponseType;
  };

export interface NewOrderResponse {
  clientOrderId: string;
  cumQuantity: number;
  cumBase: number;
  executedQuantity: number;
  orderId: number;
  averagePrice: number;
  origQuantity: number;
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
  type: usdtM.PositionOrderType;
  origType: usdtM.OrderType;
  activatePrice: number;
  priceRate: number;
  updateTime: Date;
  workingType: usdtM.WorkingType;
  priceProtect: boolean;
}

export interface NewOrderResponseRaw {
  clientOrderId: string;
  cumQty: string;
  cumBase: string;
  executedQty: string;
  orderId: number;
  avgPrice: string;
  origQty: string;
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
  type: usdtM.PositionOrderType;
  origType: usdtM.OrderType;
  activatePrice: string;
  priceRate: string;
  updateTime: number;
  workingType: usdtM.WorkingType;
  priceProtect: boolean;
}

export async function newOrder(client: BinanceSignedClient, payload: NewOrderPayload) {
  const response = await apiCall<NewOrderResponseRaw>({
    host: 'usdtM',
    path: '/dapi/v1/orde',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payload,
  });

  return parse<NewOrderResponseRaw, NewOrderResponse>(
    response,
    ({
      cumQty,
      cumBase,
      executedQty,
      avgPrice,
      origQty,
      price,
      stopPrice,
      activatePrice,
      priceRate,
      updateTime,
      ...other
    }) => ({
      cumQuantity: parse(cumQty, numberParser),
      cumBase: parse(cumBase, numberParser),
      executedQuantity: parse(executedQty, numberParser),
      averagePrice: parse(avgPrice, numberParser),
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
