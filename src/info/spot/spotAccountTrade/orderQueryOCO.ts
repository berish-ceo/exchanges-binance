import { dateParser, numberParser, parse } from '@berish/safe-parsing';
import { OrderResultResponse, OrderResultResponseRaw, parseOrder } from './order';
import { OrderOCOBaseResponse, OrderOCOBaseResponseRaw, parseOrderOCO } from './orderOCO';

export interface OrderOCOQueryResponse extends OrderOCOBaseResponse {}
export interface OrderOCOQueryResponseRaw extends OrderOCOBaseResponseRaw {}

export function parseQueryOrderOCO(response: OrderOCOQueryResponseRaw) {
  return parse<OrderOCOQueryResponseRaw, OrderOCOQueryResponse>(response, ({ ...other }) => ({
    ...parseOrderOCO(other),
  }));
}
