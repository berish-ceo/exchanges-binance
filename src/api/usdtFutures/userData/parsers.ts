import { spot, usdtM } from '../../../info';
import { dateParser, numberParser, parse, parseArray } from '@berish/safe-parsing';

export type UserDataResponse =
  | ListenKeyExpiredResponse
  | MarginCallResponse
  | AccountUpdateResponse
  | OrderTradeUpdateResponse
  | AccountConfigUpdateResponse;
export type UserDataResponseRaw =
  | ListenKeyExpiredResponseRaw
  | MarginCallResponseRaw
  | AccountUpdateResponseRaw
  | OrderTradeUpdateResponseRaw
  | AccountConfigUpdateResponseRaw;

export interface ListenKeyExpiredResponse {
  eventType: 'listenKeyExpired';
  eventTime: Date;
}

export interface ListenKeyExpiredResponseRaw {
  e: 'listenKeyExpired';
  E: number;
}

export interface MarginCallResponse {
  eventType: 'MARGIN_CALL';
  eventTime: Date;
  crossWalletBalance: number;
  positionsOfMarginCall: {
    symbol: string;
    positionSide: usdtM.PositionSide;
    positionAmount: number;
    marginType: usdtM.MarginType;
    isolatedWallet: number;
    markPrice: number;
    unrealizedPnL: number;
    maintenanceMarginRequired: number;
  }[];
}

export interface MarginCallResponseRaw {
  e: 'MARGIN_CALL';
  E: number;
  cw: string;
  p: {
    s: string;
    ps: usdtM.PositionSide;
    pa: string;
    mt: usdtM.MarginType;
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
      marginType: usdtM.MarginType;
      isolatedWallet: number;
      positionSide: usdtM.PositionSide;
    }[];
  };
}
export interface AccountUpdateResponseRaw {
  e: 'ACCOUNT_UPDATE';
  E: number;
  T: number;
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
      mt: usdtM.MarginType;
      iw: string;
      ps: usdtM.PositionSide;
    }[];
  };
}

export interface OrderTradeUpdateResponse {
  eventType: 'ORDER_TRADE_UPDATE';
  eventTime: Date;
  transactionTime: Date;

  symbol: string;
  clientOrderId: string;
  side: usdtM.OrderSide;
  orderType: usdtM.OrderType;
  timeInForce: usdtM.TimeInForce;
  originalQuantity: number;
  originalPrice: number;
  averagePrice: number;
  stopPrice: number;
  executionType: usdtM.ExecutionType;
  orderStatus: usdtM.OrderStatus;
  orderId: number;
  orderLastFilledQuantity: number;
  orderFilledAccumulatedQuantity: number;
  lastFilledPrice: number;

  commissionAsset: string;
  commissionAmount: number;

  orderTradeTime: Date;
  tradeId: number;
  bidsNotional: number;
  asksNotional: number;

  isBuyerMaker: boolean;
  isReduceOnly: boolean;

  stopPriceWorkingType: usdtM.WorkingType;
  originalOrderType: usdtM.OrderType;
  positionSide: usdtM.PositionSide;
  isConditionalOrder: boolean;
  activationPrice: number;
  callbackRate: number;
  realizedProfit: number;
}

export interface OrderTradeUpdateResponseRaw {
  e: 'ORDER_TRADE_UPDATE'; // Event Type
  E: number;
  T: number; // Transaction Time
  o: {
    s: string;
    c: string;
    S: usdtM.OrderSide;
    o: usdtM.OrderType;
    f: usdtM.TimeInForce;
    q: string;
    p: string;
    ap: string;
    sp: string;
    x: usdtM.ExecutionType;
    X: usdtM.OrderStatus;
    i: number;
    l: string;
    z: string;
    L: string;
    N: string;
    n: string;
    T: number;
    t: number;
    b: string;
    a: string;
    m: boolean;
    R: boolean;
    wt: usdtM.WorkingType;
    ot: usdtM.OrderType;
    ps: usdtM.PositionSide;
    cp: boolean;
    AP: string;
    cr: string;
    rp: string;
  };
}

export interface AccountConfigUpdateResponse {
  eventType: 'ACCOUNT_CONFIG_UPDATE';
  eventTime: Date;
  transactionTime: Date;

  accountTradingPairConfig?: {
    symbol: string;
    leverage: number;
  };

  accountConfig?: {
    multiAssetsMode: boolean;
  };
}

export interface AccountConfigUpdateResponseRaw {
  e: 'ACCOUNT_CONFIG_UPDATE';
  E: number;
  T: number;
  ac: {
    s: string;
    l: number;
  };

  ai: {
    j: boolean;
  };
}

export function parseListenKeyExpired(data: ListenKeyExpiredResponseRaw) {
  return parse<ListenKeyExpiredResponseRaw, ListenKeyExpiredResponse>(data, ({ e, E, ...other }) => ({
    eventType: 'listenKeyExpired',
    eventTime: parse(E, dateParser),
    ...other,
  }));
}

export function parseMarginCall(data: MarginCallResponseRaw) {
  return parse<MarginCallResponseRaw, MarginCallResponse>(data, ({ e, E, cw, p, ...other }) => ({
    eventType: 'MARGIN_CALL',
    eventTime: parse(E, dateParser),
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
  return parse<AccountUpdateResponseRaw, AccountUpdateResponse>(data, ({ e, E, T, a, ...other }) => ({
    eventType: 'ACCOUNT_UPDATE',
    eventTime: parse(E, dateParser),
    transactionTime: parse(T, dateParser),
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
  return parse<OrderTradeUpdateResponseRaw, OrderTradeUpdateResponse>(data, ({ e, E, T, o, ...other }) => ({
    eventType: 'ORDER_TRADE_UPDATE',
    eventTime: parse(E, dateParser),
    transactionTime: parse(T, dateParser),
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
        N,
        n,
        T,
        t,
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
        rp,
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

        commissionAsset: N,
        commissionAmount: parse(n, numberParser),

        orderTradeTime: parse(T, dateParser),
        tradeId: t,
        bidsNotional: parse(b, numberParser),
        asksNotional: parse(a, numberParser),

        isBuyerMaker: m,
        isReduceOnly: R,

        stopPriceWorkingType: wt,
        originalOrderType: ot,
        positionSide: ps,
        isConditionalOrder: cp,
        activationPrice: parse(AP, numberParser),
        callbackRate: parse(cr, numberParser),
        realizedProfit: parse(rp, numberParser),

        ...other,
      }),
    ),
  }));
}

export function parseAccountConfigUpdate(data: AccountConfigUpdateResponseRaw) {
  return parse<AccountConfigUpdateResponseRaw, AccountConfigUpdateResponse>(data, ({ e, E, T, ac, ai, ...other }) => ({
    eventType: 'ACCOUNT_CONFIG_UPDATE',
    eventTime: parse(E, dateParser),
    transactionTime: parse(T, dateParser),
    accountTradingPairConfig: parse(ac, ({ s, l, ...other }) => ({
      symbol: s,
      leverage: l,
      ...other,
    })),
    accountConfig: parse(ai, ({ j, ...other }) => ({
      multiAssetsMode: j,
      ...other,
    })),
    ...other,
  }));
}

export function parseUserData(data: UserDataResponseRaw) {
  return parse<UserDataResponseRaw, UserDataResponse>(data, (data) => {
    if (data.e === 'listenKeyExpired') return parseListenKeyExpired(data);
    if (data.e === 'MARGIN_CALL') return parseMarginCall(data);
    if (data.e === 'ACCOUNT_UPDATE') return parseAccountUpdate(data);
    if (data.e === 'ORDER_TRADE_UPDATE') return parseOrderTradeUpdate(data);
    if (data.e === 'ACCOUNT_CONFIG_UPDATE') return parseAccountConfigUpdate(data);

    return data;
  });
}
