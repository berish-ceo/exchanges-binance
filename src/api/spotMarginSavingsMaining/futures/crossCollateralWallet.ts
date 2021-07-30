import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CrossCollateralWalletResponse {
  totalCrossCollateral: number;
  totalBorrowed: number;
  totalInterest: number;
  interestFreeLimit: number;
  asset: string;
  crossCollaterals: {
    collateralCoin: string;
    locked: number;
    loanAmount: number;
    currentCollateralRate: number;
    interestFreeLimitUsed: number;
    principalForInterest: number;
    interest: number;
  }[];
}

interface CrossCollateralWalletResponseRaw {
  totalCrossCollateral: string;
  totalBorrowed: string;
  totalInterest: string;
  interestFreeLimit: string;
  asset: string;
  crossCollaterals: {
    collateralCoin: string;
    locked: string;
    loanAmount: string;
    currentCollateralRate: string;
    interestFreeLimitUsed: string;
    principalForInterest: string;
    interest: string;
  }[];
}

export async function crossCollateralWallet(client: BinanceSignedClient) {
  const response = await apiCall<CrossCollateralWalletResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/wallet',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<CrossCollateralWalletResponseRaw, CrossCollateralWalletResponse>(
    response,
    ({ totalCrossCollateral, totalBorrowed, totalInterest, interestFreeLimit, crossCollaterals, ...other }) => ({
      totalCrossCollateral: parse(totalCrossCollateral, numberParser),
      totalBorrowed: parse(totalBorrowed, numberParser),
      totalInterest: parse(totalInterest, numberParser),
      interestFreeLimit: parse(interestFreeLimit, numberParser),
      crossCollaterals: parseArray(
        crossCollaterals,
        ({
          locked,
          loanAmount,
          currentCollateralRate,
          interestFreeLimitUsed,
          principalForInterest,
          interest,
          ...other
        }) => ({
          locked: parse(locked, numberParser),
          loanAmount: parse(loanAmount, numberParser),
          currentCollateralRate: parse(currentCollateralRate, numberParser),
          interestFreeLimitUsed: parse(interestFreeLimitUsed, numberParser),
          principalForInterest: parse(principalForInterest, numberParser),
          interest: parse(interest, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
