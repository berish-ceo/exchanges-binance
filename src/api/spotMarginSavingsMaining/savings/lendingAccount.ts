import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface LendingAccountResponse {
  positionAmountVos: {
    amount: number;
    amountInBTC: number;
    amountInUSDT: number;
    asset: string;
  }[];
  totalAmountInBTC: number;
  totalAmountInUSDT: number;
  totalFixedAmountInBTC: number;
  totalFixedAmountInUSDT: number;
  totalFlexibleInBTC: number;
  totalFlexibleInUSDT: number;
}

interface LendingAccountResponseRaw {
  positionAmountVos: {
    amount: string;
    amountInBTC: string;
    amountInUSDT: string;
    asset: string;
  }[];
  totalAmountInBTC: string;
  totalAmountInUSDT: string;
  totalFixedAmountInBTC: string;
  totalFixedAmountInUSDT: string;
  totalFlexibleInBTC: string;
  totalFlexibleInUSDT: string;
}

export async function lendingAccount(client: BinanceSignedClient) {
  const response = await apiCall<LendingAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/lending/union/account',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<LendingAccountResponseRaw, LendingAccountResponse>(
    response,
    ({
      positionAmountVos,
      totalAmountInBTC,
      totalAmountInUSDT,
      totalFixedAmountInBTC,
      totalFixedAmountInUSDT,
      totalFlexibleInBTC,
      totalFlexibleInUSDT,
      ...other
    }) => ({
      positionAmountVos: parseArray(positionAmountVos, ({ amount, amountInBTC, amountInUSDT, ...other }) => ({
        amount: parse(amount, numberParser),
        amountInBTC: parse(amountInBTC, numberParser),
        amountInUSDT: parse(amountInUSDT, numberParser),
        ...other,
      })),
      totalAmountInBTC: parse(totalAmountInBTC, numberParser),
      totalAmountInUSDT: parse(totalAmountInUSDT, numberParser),
      totalFixedAmountInBTC: parse(totalFixedAmountInBTC, numberParser),
      totalFixedAmountInUSDT: parse(totalFixedAmountInUSDT, numberParser),
      totalFlexibleInBTC: parse(totalFlexibleInBTC, numberParser),
      totalFlexibleInUSDT: parse(totalFlexibleInUSDT, numberParser),
      ...other,
    }),
  );
}
