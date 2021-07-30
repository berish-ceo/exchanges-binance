import type { spot, XOR } from '../..';

export type NewOCOPayload<ResponseType extends spot.OrderResponseType = spot.OrderResponseType> = NewOCOBasePayload<ResponseType> & NewOCOStopLimitPayload;

export interface NewOCOBasePayload<OrderResponseType extends spot.OrderResponseType = spot.OrderResponseType> {
  symbol: string;
  side: spot.OrderSide;
  quantity: number;
  price: number;
  stopPrice: number;

  limitIcebergQty?: number;
  stopIcebergQty?: number;

  listClientOrderId?: string;
  limitClientOrderId?: string;
  stopClientOrderId?: string;

  newOrderRespType?: OrderResponseType;
}

export type NewOCOStopLimitPayload = XOR<
  {
    stopLimitPrice: number;
    stopLimitTimeInForce: spot.TimeInForce;
  },
  {}
>;
