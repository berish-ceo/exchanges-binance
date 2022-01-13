import type { spot } from '../../..';
import type { RefType, XORArray, XOR } from '../../utils';

export type NewOrderPayload<OrderResponseType extends spot.OrderResponseType = spot.OrderResponseType> =
  NewOrderBasePayload<OrderResponseType> &
    XORArray<
      [
        NewOrderLimitPayload,
        NewOrderMarketPayload,
        NewOrderStopLossPayload,
        NewOrderStopLossLimitPayload,
        NewOrderTakeProfitPayload,
        NewOrderTakeProfitLimitPayload,
        NewOrderLimitMakerPayload,
      ]
    >;

export interface NewOrderBasePayload<OrderResponseType extends spot.OrderResponseType = spot.OrderResponseType> {
  symbol: string;
  side: spot.OrderSide;

  newClientOrderId?: string;
  newOrderRespType?: OrderResponseType;
}

export interface NewOrderLimitPayload {
  type: RefType<spot.OrderType, 'LIMIT'>;
  timeInForce: spot.TimeInForce;
  quantity: number;
  price: number;

  icebergQty?: number;
}

export type NewOrderMarketPayload = {
  type: RefType<spot.OrderType, 'MARKET'>;
} & XOR<{ quantity: number }, { quoteOrderQty: number }>;

export interface NewOrderStopLossPayload {
  type: RefType<spot.OrderType, 'STOP_LOSS'>;
  quantity: number;
  stopPrice: number;
}

export interface NewOrderStopLossLimitPayload {
  type: RefType<spot.OrderType, 'STOP_LOSS_LIMIT'>;
  timeInForce: spot.TimeInForce;
  quantity: number;
  price: number;
  stopPrice: number;

  icebergQty?: number;
}
export interface NewOrderTakeProfitPayload {
  type: RefType<spot.OrderType, 'TAKE_PROFIT'>;
  quantity: number;
  stopPrice: number;
}
export interface NewOrderTakeProfitLimitPayload {
  type: RefType<spot.OrderType, 'TAKE_PROFIT_LIMIT'>;
  timeInForce: spot.TimeInForce;
  quantity: number;
  price: number;
  stopPrice: number;

  icebergQty?: number;
}
export interface NewOrderLimitMakerPayload {
  type: RefType<spot.OrderType, 'LIMIT_MAKER'>;
  quantity: number;
  price: number;
}
