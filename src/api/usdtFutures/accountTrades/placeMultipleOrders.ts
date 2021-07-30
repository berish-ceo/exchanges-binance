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
import { NewOrderPayload, NewOrderPayloadRaw, NewOrderResponse, NewOrderResponseRaw } from './newOrder';

export type PlaceMultipleOrdersResponse = NewOrderResponse;

type PlaceMultipleOrdersResponseRaw = NewOrderResponseRaw;

export async function placeMultipleOrders(client: BinanceSignedClient, batchOrders: NewOrderPayload[]) {
  const batchOrdersRaw = parseArray<NewOrderPayload, NewOrderPayloadRaw>(
    batchOrders,
    ({ quantity, price, stopPrice, activationPrice, ...other }) => ({
      quantity: parse(quantity, stringParser),
      price: parse(price, stringParser),
      stopPrice: parse(stopPrice, stringParser),
      activationPrice: parse(activationPrice, stringParser),
      ...other,
    }),
  );

  const response = await apiCall<PlaceMultipleOrdersResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/batchOrders',
    method: 'POST',
    securityType: 'TRADE',

    client,
    data: { batchOrders: batchOrdersRaw },
  });

  return parseArray<PlaceMultipleOrdersResponseRaw, PlaceMultipleOrdersResponse>(
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
