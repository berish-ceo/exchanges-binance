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
import { usdtM } from '../../../info';

export interface GetAllLiquidationOrdersPayload {
  symbol?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface GetAllLiquidationOrdersResponse {
  symbol: string;
  price: number;
  origQuantity: number;
  executedQuantity: number;
  averagePrice: number;
  status: usdtM.OrderStatus;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  side: usdtM.OrderSide;
  time: Date;
}

interface GetAllLiquidationOrdersPayloadRaw {
  symbol?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface GetAllLiquidationOrdersResponseRaw {
  symbol: string;
  price: string;
  origQty: string;
  executedQty: string;
  averagePrice: string;
  status: usdtM.OrderStatus;
  timeInForce: usdtM.TimeInForce;
  type: usdtM.OrderType;
  side: usdtM.OrderSide;
  time: number;
}

export async function getAllLiquidationOrders(client: BinanceSignedClient, payload?: GetAllLiquidationOrdersPayload) {
  const payloadRaw = parse<GetAllLiquidationOrdersPayload, GetAllLiquidationOrdersPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<GetAllLiquidationOrdersResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/allForceOrders',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<GetAllLiquidationOrdersResponseRaw, GetAllLiquidationOrdersResponse>(
    response,
    ({ price, origQty, executedQty, averagePrice, time, ...other }) => ({
      price: parse(price, numberParser),
      origQuantity: parse(origQty, numberParser),
      executedQuantity: parse(executedQty, numberParser),
      averagePrice: parse(averagePrice, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
