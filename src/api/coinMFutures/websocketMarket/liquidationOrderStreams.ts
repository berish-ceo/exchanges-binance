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
import { coinM } from '../../../info';

export interface LiquidationOrderStreamsResponse {
  eventTime: Date;
  symbol: string;
  pair: string;
  side: coinM.OrderSide;
  orderType: coinM.OrderType;
  timeInForce: coinM.TimeInForce;
  originalQuantity: number;
  price: number;
  averagePrice: number;
  orderStatus: coinM.OrderStatus;
  orderLastFilledQuantity: number;
  orderFilledAccumulatedQuantity: number;
  orderTradeTime: Date;
}

export interface LiquidationOrderStreamsResponseRaw {
  e: string;
  E: number;
  o: {
    s: string;
    ps: string;
    S: coinM.OrderSide;
    o: coinM.OrderType;
    f: coinM.TimeInForce;
    q: string;
    p: string;
    ap: string;
    X: coinM.OrderStatus;
    l: string;
    z: string;
    T: number;
  };
}

export function liquidationOrderStreams(
  client: BinanceClient,
  symbol: string,
  callback: (data: LiquidationOrderStreamsResponse, error?: any) => any,
) {
  if (!symbol) throw new TypeError('liquidationOrderStreams symbol is empty');
  if (typeof symbol !== 'string') throw new TypeError('liquidationOrderStreams symbol is not string');

  const parseCallback =
    callback &&
    ((data: LiquidationOrderStreamsResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parse<LiquidationOrderStreamsResponseRaw, LiquidationOrderStreamsResponse>(
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

  return apiCall(
    { host: 'coinM', path: `${symbol.toLowerCase()}@forceOrder`, securityType: 'SOCKET', client },
    parseCallback,
  );
}
