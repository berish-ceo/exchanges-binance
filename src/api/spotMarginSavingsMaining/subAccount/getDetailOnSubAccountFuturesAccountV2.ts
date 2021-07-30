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
import { spot } from '../../../info';

export interface GetDetailOnSubAccountFuturesAccountV2Payload<FuturesType extends spot.FuturesTypeEnum> {
  email: string;
  futuresType: FuturesType;
}

export interface GetDetailOnSubAccountFuturesAccountV2USDTResponse {
  email: string;
  assets: {
    asset: string;
    initialMargin: number;
    maintenanceMargin: number;
    marginBalance: number;
    maxWithdrawAmount: number;
    openOrderInitialMargin: number;
    positionInitialMargin: number;
    unrealizedProfit: number;
    walletBalance: number;
  }[];
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  feeTier: number;
  maxWithdrawAmount: number;
  totalInitialMargin: number;
  totalMaintenanceMargin: number;
  totalMarginBalance: number;
  totalOpenOrderInitialMargin: number;
  totalPositionInitialMargin: number;
  totalUnrealizedProfit: number;
  totalWalletBalance: number;
  updateTime: Date;
}

export interface GetDetailOnSubAccountFuturesAccountV2COINResponse {
  email: string;
  assets: {
    asset: string;
    initialMargin: number;
    maintenanceMargin: number;
    marginBalance: number;
    maxWithdrawAmount: number;
    openOrderInitialMargin: number;
    positionInitialMargin: number;
    unrealizedProfit: number;
    walletBalance: number;
  }[];
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  feeTier: number;
  updateTime: Date;
}
interface GetDetailOnSubAccountFuturesAccountV2USDTResponseRaw {
  futureAccountResp: {
    email: string;
    assets: {
      asset: string;
      initialMargin: string;
      maintenanceMargin: string;
      marginBalance: string;
      maxWithdrawAmount: string;
      openOrderInitialMargin: string;
      positionInitialMargin: string;
      unrealizedProfit: string;
      walletBalance: string;
    }[];
    canDeposit: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
    feeTier: number;
    maxWithdrawAmount: string;
    totalInitialMargin: string;
    totalMaintenanceMargin: string;
    totalMarginBalance: string;
    totalOpenOrderInitialMargin: string;
    totalPositionInitialMargin: string;
    totalUnrealizedProfit: string;
    totalWalletBalance: string;
    updateTime: number;
  };
}

interface GetDetailOnSubAccountFuturesAccountV2COINResponseRaw {
  deliveryAccountResp: {
    email: string;
    assets: {
      asset: string;
      initialMargin: string;
      maintenanceMargin: string;
      marginBalance: string;
      maxWithdrawAmount: string;
      openOrderInitialMargin: string;
      positionInitialMargin: string;
      unrealizedProfit: string;
      walletBalance: string;
    }[];
    canDeposit: boolean;
    canTrade: boolean;
    canWithdraw: boolean;
    feeTier: number;
    updateTime: number;
  };
}

export async function getDetailOnSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetDetailOnSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum.USDT_MARGINED_FUTURES>,
): Promise<GetDetailOnSubAccountFuturesAccountV2USDTResponse>;
export async function getDetailOnSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetDetailOnSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum.COIN_MARGINED_FUTURES>,
): Promise<GetDetailOnSubAccountFuturesAccountV2COINResponse>;
export async function getDetailOnSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetDetailOnSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum>,
): Promise<GetDetailOnSubAccountFuturesAccountV2USDTResponse | GetDetailOnSubAccountFuturesAccountV2COINResponse>;
export async function getDetailOnSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetDetailOnSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum>,
): Promise<GetDetailOnSubAccountFuturesAccountV2USDTResponse | GetDetailOnSubAccountFuturesAccountV2COINResponse> {
  const response = await apiCall<
    GetDetailOnSubAccountFuturesAccountV2USDTResponseRaw | GetDetailOnSubAccountFuturesAccountV2COINResponseRaw
  >({
    host: 'spot',
    path: '/sapi/v2/sub-account/futures/account',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  if (payload.futuresType === spot.FuturesTypeEnum.USDT_MARGINED_FUTURES) {
    return parse<
      GetDetailOnSubAccountFuturesAccountV2USDTResponseRaw,
      GetDetailOnSubAccountFuturesAccountV2USDTResponse
    >(response as GetDetailOnSubAccountFuturesAccountV2USDTResponseRaw, ({ futureAccountResp }) =>
      parse(
        futureAccountResp,
        ({
          assets,
          maxWithdrawAmount,
          totalInitialMargin,
          totalMaintenanceMargin,
          totalMarginBalance,
          totalOpenOrderInitialMargin,
          totalPositionInitialMargin,
          totalUnrealizedProfit,
          totalWalletBalance,
          updateTime,
          ...other
        }) => ({
          assets: parseArray(
            assets,
            ({
              initialMargin,
              maintenanceMargin,
              marginBalance,
              maxWithdrawAmount,
              openOrderInitialMargin,
              positionInitialMargin,
              unrealizedProfit,
              walletBalance,
              ...other
            }) => ({
              initialMargin: parse(initialMargin, numberParser),
              maintenanceMargin: parse(maintenanceMargin, numberParser),
              marginBalance: parse(marginBalance, numberParser),
              maxWithdrawAmount: parse(maxWithdrawAmount, numberParser),
              openOrderInitialMargin: parse(openOrderInitialMargin, numberParser),
              positionInitialMargin: parse(positionInitialMargin, numberParser),
              unrealizedProfit: parse(unrealizedProfit, numberParser),
              walletBalance: parse(walletBalance, numberParser),
              ...other,
            }),
          ),
          maxWithdrawAmount: parse(maxWithdrawAmount, numberParser),
          totalInitialMargin: parse(totalInitialMargin, numberParser),
          totalMaintenanceMargin: parse(totalMaintenanceMargin, numberParser),
          totalMarginBalance: parse(totalMarginBalance, numberParser),
          totalOpenOrderInitialMargin: parse(totalOpenOrderInitialMargin, numberParser),
          totalPositionInitialMargin: parse(totalPositionInitialMargin, numberParser),
          totalUnrealizedProfit: parse(totalUnrealizedProfit, numberParser),
          totalWalletBalance: parse(totalWalletBalance, numberParser),
          updateTime: parse(updateTime, dateParser),
          ...other,
        }),
      ),
    );
  }

  if (payload.futuresType === spot.FuturesTypeEnum.COIN_MARGINED_FUTURES) {
    return parse<
      GetDetailOnSubAccountFuturesAccountV2COINResponseRaw,
      GetDetailOnSubAccountFuturesAccountV2COINResponse
    >(response as GetDetailOnSubAccountFuturesAccountV2COINResponseRaw, ({ deliveryAccountResp }) =>
      parse(deliveryAccountResp, ({ assets, updateTime, ...other }) => ({
        assets: parseArray(
          assets,
          ({
            initialMargin,
            maintenanceMargin,
            marginBalance,
            maxWithdrawAmount,
            openOrderInitialMargin,
            positionInitialMargin,
            unrealizedProfit,
            walletBalance,
            ...other
          }) => ({
            initialMargin: parse(initialMargin, numberParser),
            maintenanceMargin: parse(maintenanceMargin, numberParser),
            marginBalance: parse(marginBalance, numberParser),
            maxWithdrawAmount: parse(maxWithdrawAmount, numberParser),
            openOrderInitialMargin: parse(openOrderInitialMargin, numberParser),
            positionInitialMargin: parse(positionInitialMargin, numberParser),
            unrealizedProfit: parse(unrealizedProfit, numberParser),
            walletBalance: parse(walletBalance, numberParser),
            ...other,
          }),
        ),
        updateTime: parse(updateTime, dateParser),
        ...other,
      })),
    );
  }

  return null;
}
