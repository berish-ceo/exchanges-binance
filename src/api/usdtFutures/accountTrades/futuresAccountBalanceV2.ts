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

export interface FuturesAccountBalanceV2Response {
  accountAlias: string;
  asset: string;
  balance: number;
  crossWalletBalance: number;
  crossUnPnl: number;
  availableBalance: number;
  maxWithdrawAmount: number;
  marginAvailable: boolean;
  updateTime: Date;
}

interface FuturesAccountBalanceV2ResponseRaw {
  accountAlias: string;
  asset: string;
  balance: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  marginAvailable: boolean;
  updateTime: number;
}

export async function futuresAccountBalanceV2(client: BinanceSignedClient) {
  const response = await apiCall<FuturesAccountBalanceV2ResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v2/balance',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parseArray<FuturesAccountBalanceV2ResponseRaw, FuturesAccountBalanceV2Response>(
    response,
    ({ balance, crossWalletBalance, crossUnPnl, availableBalance, maxWithdrawAmount, updateTime, ...other }) => ({
      balance: parse(balance, numberParser),
      crossWalletBalance: parse(crossWalletBalance, numberParser),
      crossUnPnl: parse(crossUnPnl, numberParser),
      availableBalance: parse(availableBalance, numberParser),
      maxWithdrawAmount: parse(maxWithdrawAmount, numberParser),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
