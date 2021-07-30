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
  assets: {
    asset: string;
    walletBalance: number;
    unrealizedProfit: number;
    marginBalance: number;
    maintMargin: number;
    initialMargin: number;
    positionInitialMargin: number;
    openOrderInitialMargin: number;
    maxWithdrawAmount: number;
    crossWalletBalance: number;
    crossUnPnl: number;
    availableBalance: number;
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
    positionSide: usdtM.PositionSide;
    entryPrice: number;
    maxQuantity: number;
  }[];
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  feeTier: number;
  updateTime: Date;
}

interface AccountInformationV2ResponseRaw {
  assets: {
    asset: string;
    walletBalance: string;
    unrealizedProfit: string;
    marginBalance: string;
    maintMargin: string;
    initialMargin: string;
    positionInitialMargin: string;
    openOrderInitialMargin: string;
    maxWithdrawAmount: string;
    crossWalletBalance: string;
    crossUnPnl: string;
    availableBalance: string;
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
    positionSide: usdtM.PositionSide;
    entryPrice: string;
    maxQty: string;
  }[];
  canDeposit: boolean;
  canTrade: boolean;
  canWithdraw: boolean;
  feeTier: number;
  updateTime: number;
}

export async function accountInformationV2(client: BinanceSignedClient) {
  const response = await apiCall<AccountInformationV2ResponseRaw>({
    host: 'usdtM',
    path: '/dapi/v1/account',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<AccountInformationV2ResponseRaw, AccountInformationV2Response>(
    response,
    ({ updateTime, assets, positions, ...other }) => ({
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
          maxWithdrawAmount,
          crossWalletBalance,
          crossUnPnl,
          availableBalance,
          ...other
        }) => ({
          walletBalance: parse(walletBalance, numberParser),
          unrealizedProfit: parse(unrealizedProfit, numberParser),
          marginBalance: parse(marginBalance, numberParser),
          maintMargin: parse(maintMargin, numberParser),
          initialMargin: parse(initialMargin, numberParser),
          positionInitialMargin: parse(positionInitialMargin, numberParser),
          openOrderInitialMargin: parse(openOrderInitialMargin, numberParser),
          maxWithdrawAmount: parse(maxWithdrawAmount, numberParser),
          crossWalletBalance: parse(crossWalletBalance, numberParser),
          crossUnPnl: parse(crossUnPnl, numberParser),
          availableBalance: parse(availableBalance, numberParser),
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
          maxQty,
          ...other
        }) => ({
          initialMargin: parse(initialMargin, numberParser),
          maintMargin: parse(maintMargin, numberParser),
          unrealizedProfit: parse(unrealizedProfit, numberParser),
          positionInitialMargin: parse(positionInitialMargin, numberParser),
          openOrderInitialMargin: parse(openOrderInitialMargin, numberParser),
          leverage: parse(leverage, numberParser),
          entryPrice: parse(entryPrice, numberParser),
          maxQuantity: parse(maxQty, numberParser),
          ...other,
        }),
      ),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
