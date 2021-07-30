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
import { NewOrderPayload, NewOrderResponse, NewOrderResponseRaw } from './newOrder';

export type PlaceMultipleOrdersPayload = NewOrderPayload[];

export type PlaceMultipleOrdersResponse = NewOrderResponse;

type PlaceMultipleOrdersResponseRaw = NewOrderResponseRaw;

export async function placeMultipleOrders(client: BinanceSignedClient, batchOrders: PlaceMultipleOrdersPayload) {
  const response = await apiCall<PlaceMultipleOrdersResponseRaw[]>({
    host: 'usdtM',
    path: '/dapi/v1/batchOrders',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: { batchOrders },
  });

  return parseArray<PlaceMultipleOrdersResponseRaw, PlaceMultipleOrdersResponse>(
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
