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
export interface AccountInformationV2Response {
  feeTier: number;
  canTrade: boolean;
  canDeposit: boolean;
  canWithdraw: boolean;
  updateTime: Date;
  totalInitialMargin: number;
  totalMaintMargin: number;
  totalWalletBalance: number;
  totalUnrealizedProfit: number;
  totalMarginBalance: number;
  totalPositionInitialMargin: number;
  totalOpenOrderInitialMargin: number;
  totalCrossWalletBalance: number;
  totalCrossUnPnl: number;
  availableBalance: number;
  maxWithdrawAmount: number;
  assets: {
    asset: string;
    walletBalance: number;
    unrealizedProfit: number;
    marginBalance: number;
    maintMargin: number;
    initialMargin: number;
    positionInitialMargin: number;
    openOrderInitialMargin: number;
    crossWalletBalance: number;
    crossUnPnl: number;
    availableBalance: number;
    maxWithdrawAmount: number;
  }[];
  positions: {
    symbol: string;
    initialMargin: number;
    maintMargin: number;
    unrealizedProfit: number;
    positionInitialMargin: number;
    openOrderInitialMargin: number;
    leverage: number;
    isolated: boolean;
    entryPrice: number;
    maxNotional: number;
    positionSide: usdtM.PositionSide;
    positionAmt: number;
  }[];
}

interface AccountInformationV2ResponseRaw {
  feeTier: number;
  canTrade: boolean;
  canDeposit: boolean;
  canWithdraw: boolean;
  updateTime: number;
  totalInitialMargin: string;
  totalMaintMargin: string;
  totalWalletBalance: string;
  totalUnrealizedProfit: string;
  totalMarginBalance: string;
  totalPositionInitialMargin: string;
  totalOpenOrderInitialMargin: string;
  totalCrossWalletBalance: string;
  totalCrossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  assets: {
    asset: string;
    walletBalance: string;
    unrealizedProfit: string;
    marginBalance: string;
    maintMargin: string;
    initialMargin: string;
    positionInitialMargin: string;
    openOrderInitialMargin: string;
    crossWalletBalance: string;
    crossUnPnl: string;
    availableBalance: string;
    maxWithdrawAmount: string;
  }[];
  positions: {
    symbol: string;
    initialMargin: string;
    maintMargin: string;
    unrealizedProfit: string;
    positionInitialMargin: string;
    openOrderInitialMargin: string;
    leverage: string;
    isolated: boolean;
    entryPrice: string;
    maxNotional: string;
    positionSide: usdtM.PositionSide;
    positionAmt: string;
  }[];
}

export async function accountInformationV2(client: BinanceSignedClient) {
  const response = await apiCall<AccountInformationV2ResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v2/account',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<AccountInformationV2ResponseRaw, AccountInformationV2Response>(
    response,
    ({
      updateTime,
      totalInitialMargin,
      totalMaintMargin,
      totalWalletBalance,
      totalUnrealizedProfit,
      totalMarginBalance,
      totalPositionInitialMargin,
      totalOpenOrderInitialMargin,
      totalCrossWalletBalance,
      totalCrossUnPnl,
      availableBalance,
      maxWithdrawAmount,
      assets,
      positions,
      ...other
    }) => ({
      updateTime: parse(updateTime, dateParser),
      totalInitialMargin: parse(totalInitialMargin, numberParser),
      totalMaintMargin: parse(totalMaintMargin, numberParser),
      totalWalletBalance: parse(totalWalletBalance, numberParser),
      totalUnrealizedProfit: parse(totalUnrealizedProfit, numberParser),
      totalMarginBalance: parse(totalMarginBalance, numberParser),
      totalPositionInitialMargin: parse(totalPositionInitialMargin, numberParser),
      totalOpenOrderInitialMargin: parse(totalOpenOrderInitialMargin, numberParser),
      totalCrossWalletBalance: parse(totalCrossWalletBalance, numberParser),
      totalCrossUnPnl: parse(totalCrossUnPnl, numberParser),
      availableBalance: parse(availableBalance, numberParser),
      maxWithdrawAmount: parse(maxWithdrawAmount, numberParser),
      assets: parseArray(
        assets,
        ({
          walletBalance,
          unrealizedProfit,
          marginBalance,
          maintMargin,
          initialMargin,
          positionInitialMargin,
          openOrderInitialMargin,
          crossWalletBalance,
          crossUnPnl,
          availableBalance,
          maxWithdrawAmount,
          ...other
        }) => ({
          walletBalance: parse(walletBalance, numberParser),
          unrealizedProfit: parse(unrealizedProfit, numberParser),
          marginBalance: parse(marginBalance, numberParser),
          maintMargin: parse(maintMargin, numberParser),
          initialMargin: parse(initialMargin, numberParser),
          positionInitialMargin: parse(positionInitialMargin, numberParser),
          openOrderInitialMargin: parse(openOrderInitialMargin, numberParser),
          crossWalletBalance: parse(crossWalletBalance, numberParser),
          crossUnPnl: parse(crossUnPnl, numberParser),
          availableBalance: parse(availableBalance, numberParser),
          maxWithdrawAmount: parse(maxWithdrawAmount, numberParser),
          ...other,
        }),
      ),
      positions: parseArray(
        positions,
        ({
          initialMargin,
          maintMargin,
          unrealizedProfit,
          positionInitialMargin,
          openOrderInitialMargin,
          leverage,
          entryPrice,
          maxNotional,
          positionAmt,
          ...other
        }) => ({
          initialMargin: parse(initialMargin, numberParser),
          maintMargin: parse(maintMargin, numberParser),
          unrealizedProfit: parse(unrealizedProfit, numberParser),
          positionInitialMargin: parse(positionInitialMargin, numberParser),
          openOrderInitialMargin: parse(openOrderInitialMargin, numberParser),
          leverage: parse(leverage, numberParser),
          entryPrice: parse(entryPrice, numberParser),
          maxNotional: parse(maxNotional, numberParser),
          positionAmt: parse(positionAmt, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
