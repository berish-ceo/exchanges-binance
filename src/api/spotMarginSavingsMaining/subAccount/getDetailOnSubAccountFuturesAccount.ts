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

export interface GetDetailOnSubAccountFuturesAccountResponse {
  email: string;
  asset: string;
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

interface GetDetailOnSubAccountFuturesAccountResponseRaw {
  email: string;
  asset: string;
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
}

export async function getDetailOnSubAccountFuturesAccount(client: BinanceSignedClient, email: string) {
  const response = await apiCall<GetDetailOnSubAccountFuturesAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/futures/account',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { email },
  });

  return parse<GetDetailOnSubAccountFuturesAccountResponseRaw, GetDetailOnSubAccountFuturesAccountResponse>(
    response,
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
  );
}
