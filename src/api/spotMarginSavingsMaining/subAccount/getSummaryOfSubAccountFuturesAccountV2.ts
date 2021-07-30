import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface GetSummaryOfSubAccountFuturesAccountV2Payload<FuturesType extends spot.FuturesTypeEnum> {
  futuresType: FuturesType;
  page?: number;
  limit?: number;
}

export interface GetSummaryOfSubAccountFuturesAccountV2USDTResponse {
  totalInitialMargin: number;
  totalMaintenanceMargin: number;
  totalMarginBalance: number;
  totalOpenOrderInitialMargin: number;
  totalPositionInitialMargin: number;
  totalUnrealizedProfit: number;
  totalWalletBalance: number;
  asset: string;
  subAccountList: {
    email: string;
    totalInitialMargin: number;
    totalMaintenanceMargin: number;
    totalMarginBalance: number;
    totalOpenOrderInitialMargin: number;
    totalPositionInitialMargin: number;
    totalUnrealizedProfit: number;
    totalWalletBalance: number;
    asset: string;
  }[];
}

interface GetSummaryOfSubAccountFuturesAccountV2USDTResponseRaw {
  futureAccountSummaryResp: {
    totalInitialMargin: string;
    totalMaintenanceMargin: string;
    totalMarginBalance: string;
    totalOpenOrderInitialMargin: string;
    totalPositionInitialMargin: string;
    totalUnrealizedProfit: string;
    totalWalletBalance: string;
    asset: string;
    subAccountList: {
      email: string;
      totalInitialMargin: string;
      totalMaintenanceMargin: string;
      totalMarginBalance: string;
      totalOpenOrderInitialMargin: string;
      totalPositionInitialMargin: string;
      totalUnrealizedProfit: string;
      totalWalletBalance: string;
      asset: string;
    }[];
  };
}

export interface GetSummaryOfSubAccountFuturesAccountV2COINResponse {
  totalMarginBalanceOfBTC: number;
  totalUnrealizedProfitOfBTC: number;
  totalWalletBalanceOfBTC: number;
  asset: string;
  subAccountList: {
    email: string;
    totalMarginBalance: number;
    totalUnrealizedProfit: number;
    totalWalletBalance: number;
    asset: string;
  }[];
}

interface GetSummaryOfSubAccountFuturesAccountV2COINResponseRaw {
  deliveryAccountSummaryResp: {
    totalMarginBalanceOfBTC: string;
    totalUnrealizedProfitOfBTC: string;
    totalWalletBalanceOfBTC: string;
    asset: string;
    subAccountList: {
      email: string;
      totalMarginBalance: string;
      totalUnrealizedProfit: string;
      totalWalletBalance: string;
      asset: string;
    }[];
  };
}

export async function getSummaryOfSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetSummaryOfSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum.USDT_MARGINED_FUTURES>,
): Promise<GetSummaryOfSubAccountFuturesAccountV2USDTResponse>;
export async function getSummaryOfSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetSummaryOfSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum.COIN_MARGINED_FUTURES>,
): Promise<GetSummaryOfSubAccountFuturesAccountV2COINResponse>;
export async function getSummaryOfSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetSummaryOfSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum>,
): Promise<GetSummaryOfSubAccountFuturesAccountV2USDTResponse | GetSummaryOfSubAccountFuturesAccountV2COINResponse>;
export async function getSummaryOfSubAccountFuturesAccountV2(
  client: BinanceSignedClient,
  payload: GetSummaryOfSubAccountFuturesAccountV2Payload<spot.FuturesTypeEnum>,
): Promise<GetSummaryOfSubAccountFuturesAccountV2USDTResponse | GetSummaryOfSubAccountFuturesAccountV2COINResponse> {
  const response = await apiCall<
    GetSummaryOfSubAccountFuturesAccountV2USDTResponseRaw | GetSummaryOfSubAccountFuturesAccountV2COINResponseRaw
  >({
    host: 'spot',
    path: '/sapi/v2/sub-account/futures/accountSummary',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  if (payload.futuresType === spot.FuturesTypeEnum.USDT_MARGINED_FUTURES) {
    return parse<
      GetSummaryOfSubAccountFuturesAccountV2USDTResponseRaw,
      GetSummaryOfSubAccountFuturesAccountV2USDTResponse
    >(response as GetSummaryOfSubAccountFuturesAccountV2USDTResponseRaw, ({ futureAccountSummaryResp }) =>
      parse(
        futureAccountSummaryResp,
        ({
          totalInitialMargin,
          totalMaintenanceMargin,
          totalMarginBalance,
          totalOpenOrderInitialMargin,
          totalPositionInitialMargin,
          totalUnrealizedProfit,
          totalWalletBalance,
          subAccountList,
          ...other
        }) => ({
          subAccountList: parseArray(
            subAccountList,
            ({
              totalInitialMargin,
              totalMaintenanceMargin,
              totalMarginBalance,
              totalOpenOrderInitialMargin,
              totalPositionInitialMargin,
              totalUnrealizedProfit,
              totalWalletBalance,
              ...other
            }) => ({
              totalInitialMargin: parse(totalInitialMargin, numberParser),
              totalMaintenanceMargin: parse(totalMaintenanceMargin, numberParser),
              totalMarginBalance: parse(totalMarginBalance, numberParser),
              totalOpenOrderInitialMargin: parse(totalOpenOrderInitialMargin, numberParser),
              totalPositionInitialMargin: parse(totalPositionInitialMargin, numberParser),
              totalUnrealizedProfit: parse(totalUnrealizedProfit, numberParser),
              totalWalletBalance: parse(totalWalletBalance, numberParser),
              ...other,
            }),
          ),
          totalInitialMargin: parse(totalInitialMargin, numberParser),
          totalMaintenanceMargin: parse(totalMaintenanceMargin, numberParser),
          totalMarginBalance: parse(totalMarginBalance, numberParser),
          totalOpenOrderInitialMargin: parse(totalOpenOrderInitialMargin, numberParser),
          totalPositionInitialMargin: parse(totalPositionInitialMargin, numberParser),
          totalUnrealizedProfit: parse(totalUnrealizedProfit, numberParser),
          totalWalletBalance: parse(totalWalletBalance, numberParser),
          ...other,
        }),
      ),
    );
  }

  if (payload.futuresType === spot.FuturesTypeEnum.COIN_MARGINED_FUTURES) {
    return parse<
      GetSummaryOfSubAccountFuturesAccountV2COINResponseRaw,
      GetSummaryOfSubAccountFuturesAccountV2COINResponse
    >(response as GetSummaryOfSubAccountFuturesAccountV2COINResponseRaw, ({ deliveryAccountSummaryResp }) =>
      parse(
        deliveryAccountSummaryResp,
        ({
          totalMarginBalanceOfBTC,
          totalUnrealizedProfitOfBTC,
          totalWalletBalanceOfBTC,
          subAccountList,
          ...other
        }) => ({
          totalMarginBalanceOfBTC: parse(totalMarginBalanceOfBTC, numberParser),
          totalUnrealizedProfitOfBTC: parse(totalUnrealizedProfitOfBTC, numberParser),
          totalWalletBalanceOfBTC: parse(totalWalletBalanceOfBTC, numberParser),

          subAccountList: parseArray(
            subAccountList,
            ({ totalMarginBalance, totalUnrealizedProfit, totalWalletBalance, ...other }) => ({
              totalMarginBalance: parse(totalMarginBalance, numberParser),
              totalUnrealizedProfit: parse(totalUnrealizedProfit, numberParser),
              totalWalletBalance: parse(totalWalletBalance, numberParser),
              ...other,
            }),
          ),
          ...other,
        }),
      ),
    );
  }

  return null;
}
