import { BinanceClient } from '../../../clients';
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

import type { LiquidationOrderStreamsResponse, LiquidationOrderStreamsResponseRaw } from './liquidationOrderStreams';

export type AllMarketLiquidationOrderStreamsResponse = LiquidationOrderStreamsResponse;

type AllMarketLiquidationOrderStreamsResponseRaw = LiquidationOrderStreamsResponseRaw;

export function allMarketLiquidationOrderStreams(
  client: BinanceClient,
  callback: (data: AllMarketLiquidationOrderStreamsResponse, error?: any) => any,
) {
  const parseCallback =
    callback &&
    ((data: AllMarketLiquidationOrderStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<AllMarketLiquidationOrderStreamsResponseRaw, AllMarketLiquidationOrderStreamsResponse>(
        data,
        ({ e, E, o, ...other }) => ({
          eventTime: parse(E, dateParser),
          ...other,

          ...parse(o, ({ s, ps, S, o, f, q, p, ap, X, l, z, T, ...other }) => ({
            symbol: s,
            pair: ps,
            side: S,
            orderType: o,
            timeInForce: f,
            originalQuantity: parse(q, numberParser),
            price: parse(p, numberParser),
            averagePrice: parse(ap, numberParser),
            orderStatus: X,
            orderLastFilledQuantity: parse(l, numberParser),
            orderFilledAccumulatedQuantity: parse(z, numberParser),
            orderTradeTime: parse(T, dateParser),
            ...other,
          })),
        }),
      );

      return callback(response);
    });

  return apiCall({ host: 'coinM', path: '!forceOrder@arr', securityType: 'SOCKET', client }, parseCallback);
}
