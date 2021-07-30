import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetSummaryOfSubAccountFuturesAccountResponse {
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

interface GetSummaryOfSubAccountFuturesAccountResponseRaw {
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
}

export async function getSummaryOfSubAccountFuturesAccount(client: BinanceSignedClient) {
  const response = await apiCall<GetSummaryOfSubAccountFuturesAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/futures/accountSummary',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<GetSummaryOfSubAccountFuturesAccountResponseRaw, GetSummaryOfSubAccountFuturesAccountResponse>(
    response,
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
      totalInitialMargin: parse(totalInitialMargin, numberParser),
      totalMaintenanceMargin: parse(totalMaintenanceMargin, numberParser),
      totalMarginBalance: parse(totalMarginBalance, numberParser),
      totalOpenOrderInitialMargin: parse(totalOpenOrderInitialMargin, numberParser),
      totalPositionInitialMargin: parse(totalPositionInitialMargin, numberParser),
      totalUnrealizedProfit: parse(totalUnrealizedProfit, numberParser),
      totalWalletBalance: parse(totalWalletBalance, numberParser),
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
      ...other,
    }),
  );
}
