import { dateParser, numberParser, parse } from '@berish/safe-parsing';
import { OrderResultResponse, OrderResultResponseRaw, parseOrder } from './order';

export interface OrderQueryResponse extends OrderResultResponse {
  time?: Date;
  updateTime?: Date;
  isWorking?: boolean;
  origQuoteOrderQuantity?: number;
}
export interface OrderQueryResponseRaw extends OrderResultResponseRaw {
  time?: number;
  updateTime?: number;
  isWorking?: boolean;
  origQuoteOrderQty?: string;
}

export function parseQueryOrder(response: OrderQueryResponseRaw) {
  return parse<OrderQueryResponseRaw, OrderQueryResponse>(
    response,
    ({ time, updateTime, origQuoteOrderQty, isWorking, ...other }) => ({
      time: parse(time, dateParser),
      updateTime: parse(updateTime, dateParser),
      origQuoteOrderQuantity: parse(origQuoteOrderQty, numberParser),
      isWorking,

      ...parseOrder(other),
    }),
  );
}
