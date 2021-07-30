import { spot } from '../../../info';
import { dateParser, numberParser, parse, parseArray } from '@berish/safe-parsing';

export type UserDataResponse =
  | OutboundAccountPositionResponse
  | BalanceUpdateResponse
  | ExecutionReportResponse
  | ListStatusResponse;
export type UserDataResponseRaw =
  | OutboundAccountPositionResponseRaw
  | BalanceUpdateResponseRaw
  | ExecutionReportResponseRaw
  | ListStatusResponseRaw;

export interface OutboundAccountPositionResponse {
  eventType: 'outboundAccountPosition';
  eventTime: Date;
  timeOfLastAccountUpdate: Date;
  balances: {
    assetName: string;
    free: number;
    locked: number;
  }[];
}

export interface OutboundAccountPositionResponseRaw {
  e: 'outboundAccountPosition';
  E: number;
  u: number;
  B: {
    a: string;
    f: string;
    l: string;
  }[];
}

export interface BalanceUpdateResponse {
  eventType: 'balanceUpdate';
  eventTime: Date;
  asset: string;
  balanceDelta: number;
  clearTime: Date;
}
export interface BalanceUpdateResponseRaw {
  e: 'balanceUpdate';
  E: number;
  a: string;
  d: string;
  T: number;
}

export interface ExecutionReportResponse {
  eventType: 'executionReport';
  eventTime: Date;
  symbol: string;
  clientOrderId: string;
  side: spot.OrderSide;
  orderType: spot.OrderType;
  timeInForce: spot.TimeInForce;
  orderQuantity: number;
  orderPrice: number;
  stopPrice: number;
  icebergQuantity: number;
  orderListId: number;
  origClientOrderId: string;
  executionType: spot.ExecutionType;
  orderStatus: spot.OrderStatus;
  orderRejectReason: string;
  orderId: number;
  lastExecutedQuantity: number;
  cumulativeFilledQuantity: number;
  lastExecutedPrice: number;
  commissionAmount: number;
  commissionAsset: string;
  transactionTime: Date;
  tradeId: number;
  isBestMatch: boolean;
  isBuyerMaker: boolean;
  orderCreationTime: Date;
  cumulativeQuoteAssetTransactedQuantity: number;
  lastQuoteAssetTransactedQuantity: number;
  quoteOrderQuantity: number;
}
export interface ExecutionReportResponseRaw {
  e: 'executionReport';
  E: number;
  s: string;
  c: string; // Client order ID
  S: spot.OrderSide; // Side
  o: spot.OrderType; // Order type
  f: spot.TimeInForce; // Time in force
  q: string;
  p: string;
  P: string;
  F: string;
  g: number;
  C: string;
  x: spot.ExecutionType;
  X: spot.OrderStatus;
  r: string;
  i: number;
  l: string;
  z: string;
  L: string;
  n: string;
  N: string;
  T: number;
  t: number;
  w: boolean;
  m: boolean;
  O: number; // Order creation time
  Z: string;
  Y: string;
  Q: string;
}

export interface ListStatusResponse {
  eventType: 'listStatus';
  eventTime: Date;
  symbol: string;
  orderListId: number;
  contingencyType: spot.ContingencyType;
  listStatusType: spot.OCOStatus;
  listOrderStatusType: spot.OCOOrderStatus;
  listRejectReason: string;
  listClientOrderId: string;
  transactionTime: Date;
  orders: {
    symbol: string;
    orderId: number;
    clientOrderId: string;
  }[];
}
export interface ListStatusResponseRaw {
  e: 'listStatus';
  E: number;
  s: string;
  g: number;
  c: spot.ContingencyType;
  l: spot.OCOStatus;
  L: spot.OCOOrderStatus;
  r: string;
  C: string;
  T: number;
  O: {
    s: string;
    i: number;
    c: string;
  }[];
}

export function parseOutboundAccountPosition(data: OutboundAccountPositionResponseRaw) {
  return parse<OutboundAccountPositionResponseRaw, OutboundAccountPositionResponse>(
    data,
    ({ e, E, u, B, ...other }) => ({
      eventType: 'outboundAccountPosition',
      eventTime: parse(E, dateParser),
      timeOfLastAccountUpdate: parse(u, dateParser),
      balances: parseArray(B, ({ a, f, l, ...other }) => ({
        assetName: a,
        free: parse(f, numberParser),
        locked: parse(l, numberParser),
        ...other,
      })),
      ...other,
    }),
  );
}

export function parseBalanceUpdate(data: BalanceUpdateResponseRaw) {
  return parse<BalanceUpdateResponseRaw, BalanceUpdateResponse>(data, ({ e, E, a, d, T, ...other }) => ({
    eventType: 'balanceUpdate',
    eventTime: parse(E, dateParser),
    asset: a,
    balanceDelta: parse(d, numberParser),
    clearTime: parse(T, dateParser),
    ...other,
  }));
}

export function parseExecutionReport(data: ExecutionReportResponseRaw) {
  return parse<ExecutionReportResponseRaw, ExecutionReportResponse>(
    data,
    ({ e, E, s, c, S, o, f, q, p, P, F, g, C, x, X, r, i, l, z, L, n, N, T, t, w, m, O, Z, Y, Q, ...other }) => ({
      eventType: 'executionReport',
      eventTime: parse(E, dateParser),
      symbol: s,
      clientOrderId: c,
      side: S,
      orderType: o,
      timeInForce: f,
      orderQuantity: parse(q, numberParser),
      orderPrice: parse(p, numberParser),
      stopPrice: parse(P, numberParser),
      icebergQuantity: parse(F, numberParser),
      orderListId: g,
      origClientOrderId: C,
      executionType: x,
      orderStatus: X,
      orderRejectReason: r,
      orderId: i,
      lastExecutedQuantity: parse(l, numberParser),
      cumulativeFilledQuantity: parse(z, numberParser),
      lastExecutedPrice: parse(L, numberParser),
      commissionAmount: parse(n, numberParser),
      commissionAsset: N,
      transactionTime: parse(T, dateParser),
      tradeId: t,
      isBestMatch: w,
      isBuyerMaker: m,
      orderCreationTime: parse(O, dateParser),
      cumulativeQuoteAssetTransactedQuantity: parse(Z, numberParser),
      lastQuoteAssetTransactedQuantity: parse(Y, numberParser),
      quoteOrderQuantity: parse(Q, numberParser),
      ...other,
    }),
  );
}

export function parseListStatus(data: ListStatusResponseRaw) {
  return parse<ListStatusResponseRaw, ListStatusResponse>(data, ({ e, E, s, g, c, l, L, r, C, T, O, ...other }) => ({
    eventType: 'listStatus',
    eventTime: parse(E, dateParser),
    symbol: s,
    orderListId: g,
    contingencyType: c,
    listStatusType: l,
    listOrderStatusType: L,
    listRejectReason: r,
    listClientOrderId: C,
    transactionTime: parse(T, dateParser),
    orders: parseArray(O, ({ s, i, c, ...other }) => ({
      symbol: s,
      orderId: i,
      clientOrderId: c,
      ...other,
    })),
    ...other,
  }));
}

export function parseUserData(data: UserDataResponseRaw) {
  return parse<UserDataResponseRaw, UserDataResponse>(data, (data) => {
    if (data.e === 'outboundAccountPosition') return parseOutboundAccountPosition(data);
    if (data.e === 'balanceUpdate') return parseBalanceUpdate(data);
    if (data.e === 'executionReport') return parseExecutionReport(data);
    if (data.e === 'listStatus') return parseListStatus(data);

    return data;
  });
}
