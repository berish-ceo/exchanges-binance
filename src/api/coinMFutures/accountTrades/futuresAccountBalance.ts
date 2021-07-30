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

export interface FuturesAccountBalanceResponse {
  accountAlias: string;
  asset: string;
  balance: number;
  withdrawAvailable: number;
  crossWalletBalance: number;
  crossUnPnl: number;
  availableBalance: number;
  updateTime: Date;
}

interface FuturesAccountBalanceResponseRaw {
  accountAlias: string;
  asset: string;
  balance: string;
  withdrawAvailable: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  updateTime: number;
}

export async function futuresAccountBalance(client: BinanceSignedClient) {
  const response = await apiCall<FuturesAccountBalanceResponseRaw[]>({
    host: 'spot',
    path: '/dapi/v1/balance',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parseArray<FuturesAccountBalanceResponseRaw, FuturesAccountBalanceResponse>(
    response,
    ({ balance, withdrawAvailable, crossWalletBalance, crossUnPnl, availableBalance, updateTime, ...other }) => ({
      balance: parse(balance, numberParser),
      withdrawAvailable: parse(withdrawAvailable, numberParser),
      crossWalletBalance: parse(crossWalletBalance, numberParser),
      crossUnPnl: parse(crossUnPnl, numberParser),
      availableBalance: parse(availableBalance, numberParser),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
