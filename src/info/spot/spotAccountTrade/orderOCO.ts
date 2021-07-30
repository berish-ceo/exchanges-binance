import type { spot } from '../..';
import { dateParser, numberParser, parse, parseArray } from '@berish/safe-parsing';
import {
  OrderACKResponse,
  OrderACKResponseRaw,
  OrderFullResponse,
  OrderFullResponseRaw,
  OrderResultResponse,
  OrderResultResponseRaw,
  parseOrder,
} from './order';

export interface OrderOCOBaseResponse {
  orderListId: number;
  contingencyType: spot.ContingencyType;
  listStatusType: spot.OCOStatus;
  listOrderStatus: spot.OCOOrderStatus;
  listClientOrderId: string;
  transactionTime: Date;
  symbol: string;
  orders: {
    symbol: string;
    orderId: number;
    clientOrderId: string;
  }[];
}

export interface OrderOCOACKResponse extends OrderOCOBaseResponse {
  orderReports: OrderACKResponse[];
}
export interface OrderOCOResultResponse extends OrderOCOACKResponse {
  orderReports: OrderResultResponse[];
}
export interface OrderOCOFullResponse extends OrderOCOResultResponse {
  orderReports: OrderFullResponse[];
}

export interface OrderOCOBaseResponseRaw {
  orderListId: number;
  contingencyType: spot.ContingencyType;
  listStatusType: spot.OCOStatus;
  listOrderStatus: spot.OCOOrderStatus;
  listClientOrderId: string;
  transactionTime: number;
  symbol: string;
  orders: {
    symbol: string;
    orderId: number;
    clientOrderId: string;
  }[];
}

export interface OrderOCOACKResponseRaw extends OrderOCOBaseResponseRaw {
  orderReports: OrderACKResponseRaw[];
}

export interface OrderOCOResultResponseRaw extends OrderOCOACKResponseRaw {
  orderReports: OrderResultResponseRaw[];
}

export interface OrderOCOFullResponseRaw extends OrderOCOResultResponseRaw {
  orderReports: OrderFullResponseRaw[];
}

export function parseOrderOCO(
  response: OrderOCOBaseResponseRaw | OrderOCOACKResponseRaw | OrderOCOResultResponseRaw | OrderOCOFullResponseRaw,
) {
  return parse<OrderOCOFullResponseRaw, OrderOCOFullResponse>(
    response as OrderOCOFullResponseRaw,
    ({ transactionTime, orderReports, ...other }) => ({
      transactionTime: parse(transactionTime, dateParser),
      orderReports: parseArray(orderReports, (data) => parseOrder(data)),
      ...other,
    }),
  );
}
