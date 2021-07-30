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
import { RefType, usdtM, XOR, XORArray } from '../../../info';

export type NewOrderPayload<ResponseType extends usdtM.ResponseType = usdtM.ResponseType> = {
  symbol: string;
  side: usdtM.OrderSide;
} & XORArray<
  [
    {
      type: RefType<usdtM.OrderType, 'LIMIT'>;
      timeInForce: usdtM.TimeInForce;
      quantity: number;
      price: number;
    },
    { type: RefType<usdtM.OrderType, 'MARKET'>; quantity: number },
    { type: RefType<usdtM.OrderType, 'TRAILING_STOP_MARKET'>; callbackRate: number; activationPrice?: number },
    { stopPrice: number; priceProtect?: boolean } & XOR<
      { type: RefType<usdtM.OrderType, 'STOP' | 'TAKE_PROFIT'>; quantity: number; price: number },
      { type: RefType<usdtM.OrderType, 'STOP_MARKET' | 'TAKE_PROFIT_MARKET'>; closePosition?: boolean }
    >,
  ]
> & {
    positionSide?: usdtM.PositionSide;

    timeInForce?: usdtM.TimeInForce;
    quantity?: number;
    reduceOnly?: boolean;
    price?: number;
    newClientOrderId?: string;
    workType?: usdtM.WorkingType;
    newOrderRespType: ResponseType;
  };

export type NewOrderPayloadRaw<ResponseType extends usdtM.ResponseType = usdtM.ResponseType> = {
  symbol: string;
  side: usdtM.OrderSide;
} & (
  | {
      type: RefType<usdtM.OrderType, 'LIMIT'>;
      timeInForce: usdtM.TimeInForce;
      quantity: string;
      price: string;
    }
  | { type: RefType<usdtM.OrderType, 'MARKET'>; quantity: string }
  | { type: RefType<usdtM.OrderType, 'TRAILING_STOP_MARKET'>; callbackRate: number; activationPrice?: string }
  | ({ stopPrice: string; priceProtect?: boolean } & (
      | { type: RefType<usdtM.OrderType, 'STOP' | 'TAKE_PROFIT'>; quantity: string; price: string }
      | { type: RefType<usdtM.OrderType, 'STOP_MARKET' | 'TAKE_PROFIT_MARKET'>; closePosition?: boolean }
    ))
) & {
    positionSide?: usdtM.PositionSide;

    timeInForce?: usdtM.TimeInForce;
    quantity?: string;
    reduceOnly?: boolean;
    price?: string;
    newClientOrderId?: string;
    workType?: usdtM.WorkingType;
    newOrderRespType: ResponseType;
  };

export interface NewOrderResponse {
  clientOrderId: string;
  cumQuantity: number;
  cumQuote: number;
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
  cumQuote: string;
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
  const payloadRaw = parse<NewOrderPayload, NewOrderPayloadRaw>(
    payload,
    ({ quantity, price, stopPrice, activationPrice, ...other }) => ({
      quantity: parse(quantity, stringParser),
      price: parse(price, stringParser),
      stopPrice: parse(stopPrice, stringParser),
      activationPrice: parse(activationPrice, stringParser),
      ...other,
    }),
  );

  const response = await apiCall<NewOrderResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/order',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: payloadRaw,
  });

  return parse<NewOrderResponseRaw, NewOrderResponse>(
    response,
    ({
      cumQty,
      cumQuote,
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
      cumQuote: parse(cumQuote, numberParser),
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
