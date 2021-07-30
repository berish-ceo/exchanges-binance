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

export interface AccountInformationResponse {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: Date;
  accountType: 'SPOT';
  balances: {
    asset: string;
    free: number;
    locked: number;
  }[];
  permissions: spot.PermissionType[];
}

interface AccountInformationResponseRaw {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: 'SPOT';
  balances: {
    asset: string;
    free: string;
    locked: string;
  }[];
  permissions: spot.PermissionType[];
}

export async function accountInformation(client: BinanceSignedClient) {
  const response = await apiCall<AccountInformationResponseRaw>({
    host: 'spot',
    path: '/api/v3/account',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<AccountInformationResponseRaw, AccountInformationResponse>(
    response,
    ({ updateTime, balances, ...other }) => ({
      updateTime: parse(updateTime, dateParser),
      balances: parseArray(balances, ({ free, locked, ...other }) => ({
        free: parse(free, numberParser),
        locked: parse(locked, numberParser),
        ...other,
      })),
      ...other,
    }),
  );
}
