import type { spot } from '../../';
import { dateParser, numberParser, parse, parseArray } from '@berish/safe-parsing';
import { RefType, XOR, XORArray } from '../../utils';

export interface OrderACKResponse {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  transactTime: Date;
}

export interface OrderResultResponse extends OrderACKResponse {
  price: number;
  stopPrice: number;
  origQuantity: number;
  executedQuantity: number;
  cummulativeQuoteQuantity: number;
  icebergQuantity: number;
  status: spot.OrderStatus;
  timeInForce: spot.TimeInForce;
  type: spot.OrderType;
  side: spot.OrderSide;
}

export interface OrderFullResponse extends OrderResultResponse {
  fills: {
    price: number;
    quantity: number;
    commission: number;
    commissionAsset: string;
  }[];
}

export interface OrderACKResponseRaw {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  transactTime: number;
}

export interface OrderResultResponseRaw extends OrderACKResponseRaw {
  price: string;
  stopPrice: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  icebergQty: string;
  status: spot.OrderStatus;
  timeInForce: spot.TimeInForce;
  type: spot.OrderType;
  side: spot.OrderSide;
}

export interface OrderFullResponseRaw extends OrderResultResponseRaw {
  fills: {
    price: string;
    qty: string;
    commission: string;
    commissionAsset: string;
  }[];
}

export function parseOrder(response: OrderACKResponseRaw | OrderResultResponseRaw | OrderFullResponseRaw) {
  return parse<OrderFullResponseRaw, OrderFullResponse>(
    response as OrderFullResponseRaw,
    ({ transactTime, price, stopPrice, origQty, executedQty, cummulativeQuoteQty, icebergQty, fills, ...other }) => ({
      transactTime: parse(transactTime, dateParser),
      price: parse(price, numberParser),
      stopPrice: parse(stopPrice, numberParser),
      origQuantity: parse(origQty, numberParser),
      executedQuantity: parse(executedQty, numberParser),
      cummulativeQuoteQuantity: parse(cummulativeQuoteQty, numberParser),
      icebergQuantity: parse(icebergQty, numberParser),

      fills: parseArray(fills, ({ price, qty, commission, ...other }) => ({
        price: parse(price, numberParser),
        quantity: parse(qty, numberParser),
        commission: parse(commission, numberParser),
        ...other,
      })),
      ...other,
    }),
  );
}
