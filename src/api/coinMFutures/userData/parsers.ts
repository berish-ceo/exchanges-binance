import { spot, coinM } from '../../../info';
import { dateParser, numberParser, parse, parseArray } from '@berish/safe-parsing';

export type UserDataResponse = MarginCallResponse | AccountUpdateResponse | OrderTradeUpdateResponse;
export type UserDataResponseRaw = MarginCallResponseRaw | AccountUpdateResponseRaw | OrderTradeUpdateResponseRaw;

export interface MarginCallResponse {
  eventType: 'MARGIN_CALL';
  eventTime: Date;
  accountAlias: string;
  crossWalletBalance: number;
  positionsOfMarginCall: {
    symbol: string;
    positionSide: coinM.PositionSide;
    positionAmount: number;
    marginType: coinM.MarginType;
    isolatedWallet: number;
    markPrice: number;
    unrealizedPnL: number;
    maintenanceMarginRequired: number;
  }[];
}

export interface MarginCallResponseRaw {
  e: 'MARGIN_CALL';
  E: number;
  i: string;
  cw: string;
  p: {
    s: string;
    ps: coinM.PositionSide;
    pa: string;
    mt: coinM.MarginType;
    iw: string;
    mp: string;
    up: string;
    mm: string;
  }[];
}

export interface AccountUpdateResponse {
  eventType: 'ACCOUNT_UPDATE';
  eventTime: Date;
  transactionTime: Date;
  accountAlias: string;
  updateData: {
    eventReasonType: string;
    balances: {
      asset: string;
      walletBalance: number;
      crossWalletBalance: number;
    }[];
    positions: {
      symbol: string;
      positionAmount: number;
      entryPrice: number;
      preFeeAccumulatedRealized: number;
      unrealizedPnL: number;
      marginType: coinM.MarginType;
      isolatedWallet: number;
      positionSide: coinM.PositionSide;
    }[];
  };
}
export interface AccountUpdateResponseRaw {
  e: 'ACCOUNT_UPDATE';
  E: number;
  T: number;
  i: string;
  a: {
    m: string;
    B: {
      a: string;
      wb: string;
      cw: string;
    }[];
    P: {
      s: string;
      pa: string;
      ep: string;
      cr: string;
      up: string;
      mt: coinM.MarginType;
      iw: string;
      ps: coinM.PositionSide;
    }[];
  };
}

export interface OrderTradeUpdateResponse {
  eventType: 'ORDER_TRADE_UPDATE';
  eventTime: Date;
  transactionTime: Date;
  accountAlias: string;

  symbol: string;
  clientOrderId: string;
  side: coinM.OrderSide;
  orderType: coinM.OrderType;
  timeInForce: coinM.TimeInForce;
  originalQuantity: number;
  originalPrice: number;
  averagePrice: number;
  stopPrice: number;
  executionType: coinM.ExecutionType;
  orderStatus: coinM.OrderStatus;
  orderId: number;
  orderLastFilledQuantity: number;
  orderFilledAccumulatedQuantity: number;
  lastFilledPrice: number;

  marginAsset: string;
  commissionAsset: string;
  commissionAmount: number;

  orderTradeTime: Date;
  tradeId: number;
  realizedProfit: number;
  bidQuantityOfBaseAsset: number;
  askQuantityOfBaseAsset: number;

  isBuyerMaker: boolean;
  isReduceOnly: boolean;

  stopPriceWorkingType: coinM.WorkingType;
  originalOrderType: coinM.OrderType;
  positionSide: coinM.PositionSide;
  isConditionalOrder: boolean;
  activationPrice: number;
  callbackRate: number;
  isConditionalOrderProtected: boolean;
}

export interface OrderTradeUpdateResponseRaw {
  e: 'ORDER_TRADE_UPDATE';
  E: number;
  T: number;
  i: string;
  o: {
    s: string;
    c: string;
    S: coinM.OrderSide;
    o: coinM.OrderType;
    f: coinM.TimeInForce;
    q: string;
    p: string;
    ap: string;
    sp: string;
    x: coinM.ExecutionType;
    X: coinM.OrderStatus;
    i: number;
    l: string;
    z: string;
    L: string;

    ma: string;

    N: string;
    n: string;
    T: number;
    t: number;

    rp: string;

    b: string;
    a: string;
    m: boolean;
    R: boolean;
    wt: coinM.WorkingType;
    ot: coinM.OrderType;
    ps: coinM.PositionSide;
    cp: boolean;
    AP: string;
    cr: string;

    pP: boolean;
  };
}

export function parseMarginCall(data: MarginCallResponseRaw) {
  return parse<MarginCallResponseRaw, MarginCallResponse>(data, ({ e, E, i, cw, p, ...other }) => ({
    eventType: 'MARGIN_CALL',
    eventTime: parse(E, dateParser),
    accountAlias: i,
    crossWalletBalance: parse(cw, numberParser),
    positionsOfMarginCall: parseArray(p, ({ s, ps, pa, mt, iw, mp, up, mm, ...other }) => ({
      symbol: s,
      positionSide: ps,
      positionAmount: parse(pa, numberParser),
      marginType: mt,
      isolatedWallet: parse(iw, numberParser),
      markPrice: parse(mp, numberParser),
      unrealizedPnL: parse(up, numberParser),
      maintenanceMarginRequired: parse(mm, numberParser),
      ...other,
    })),
    ...other,
  }));
}

export function parseAccountUpdate(data: AccountUpdateResponseRaw) {
  return parse<AccountUpdateResponseRaw, AccountUpdateResponse>(data, ({ e, E, i, T, a, ...other }) => ({
    eventType: 'ACCOUNT_UPDATE',
    eventTime: parse(E, dateParser),
    transactionTime: parse(T, dateParser),
    accountAlias: i,
    updateData: parse(a, ({ m, B, P, ...other }) => ({
      eventReasonType: m,
      balances: parseArray(B, ({ a, wb, cw, ...other }) => ({
        asset: a,
        walletBalance: parse(wb, numberParser),
        crossWalletBalance: parse(cw, numberParser),
        ...other,
      })),
      positions: parseArray(P, ({ s, pa, ep, cr, up, mt, iw, ps, ...other }) => ({
        symbol: s,
        positionAmount: parse(pa, numberParser),
        entryPrice: parse(ep, numberParser),
        preFeeAccumulatedRealized: parse(cr, numberParser),
        unrealizedPnL: parse(up, numberParser),
        marginType: mt,
        isolatedWallet: parse(iw, numberParser),
        positionSide: ps,
        ...other,
      })),
      ...other,
    })),
    ...other,
  }));
}

export function parseOrderTradeUpdate(data: OrderTradeUpdateResponseRaw) {
  return parse<OrderTradeUpdateResponseRaw, OrderTradeUpdateResponse>(data, ({ e, E, T, i, o, ...other }) => ({
    eventType: 'ORDER_TRADE_UPDATE',
    eventTime: parse(E, dateParser),
    transactionTime: parse(T, dateParser),
    accountAlias: i,
    ...other,

    ...parse(
      o,
      ({
        s,
        c,
        S,
        o,
        f,
        q,
        p,
        ap,
        sp,
        x,
        X,
        i,
        l,
        z,
        L,
        ma,
        N,
        n,
        T,
        t,
        rp,
        b,
        a,
        m,
        R,
        wt,
        ot,
        ps,
        cp,
        AP,
        cr,
        pP,
        ...other
      }) => ({
        symbol: s,
        clientOrderId: c,
        side: S,
        orderType: o,
        timeInForce: f,
        originalQuantity: parse(q, numberParser),
        originalPrice: parse(p, numberParser),
        averagePrice: parse(ap, numberParser),
        stopPrice: parse(sp, numberParser),
        executionType: x,
        orderStatus: X,
        orderId: i,
        orderLastFilledQuantity: parse(l, numberParser),
        orderFilledAccumulatedQuantity: parse(z, numberParser),
        lastFilledPrice: parse(L, numberParser),

        marginAsset: ma,
        commissionAsset: N,
        commissionAmount: parse(n, numberParser),

        orderTradeTime: parse(T, dateParser),
        tradeId: t,
        realizedProfit: parse(rp, numberParser),
        bidQuantityOfBaseAsset: parse(b, numberParser),
        askQuantityOfBaseAsset: parse(a, numberParser),

        isBuyerMaker: m,
        isReduceOnly: R,

        stopPriceWorkingType: wt,
        originalOrderType: ot,
        positionSide: ps,
        isConditionalOrder: cp,
        activationPrice: parse(AP, numberParser),
        callbackRate: parse(cr, numberParser),
        isConditionalOrderProtected: pP,

        ...other,
      }),
    ),
  }));
}

export function parseUserData(data: UserDataResponseRaw) {
  return parse<UserDataResponseRaw, UserDataResponse>(data, (data) => {
    if (data.e === 'MARGIN_CALL') return parseMarginCall(data);
    if (data.e === 'ACCOUNT_UPDATE') return parseAccountUpdate(data);
    if (data.e === 'ORDER_TRADE_UPDATE') return parseOrderTradeUpdate(data);

    return null;
  });
}
