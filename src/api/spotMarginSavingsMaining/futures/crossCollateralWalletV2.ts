import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CrossCollateralWalletV2Response {
  totalCrossCollateral: number;
  totalBorrowed: number;
  totalInterest: number;
  interestFreeLimit: number;
  asset: string;
  crossCollaterals: {
    loanCoin: string;
    collateralCoin: string;
    locked: number;
    loanAmount: number;
    currentCollateralRate: number;
    interestFreeLimitUsed: number;
    principalForInterest: number;
    interest: number;
  }[];
}

interface CrossCollateralWalletV2ResponseRaw {
  totalCrossCollateral: string;
  totalBorrowed: string;
  totalInterest: string;
  interestFreeLimit: string;
  asset: string;
  crossCollaterals: {
    loanCoin: string;
    collateralCoin: string;
    locked: string;
    loanAmount: string;
    currentCollateralRate: string;
    interestFreeLimitUsed: string;
    principalForInterest: string;
    interest: string;
  }[];
}

export async function crossCollateralWalletV2(client: BinanceSignedClient) {
  const response = await apiCall<CrossCollateralWalletV2ResponseRaw>({
    host: 'spot',
    path: '/sapi/v2/futures/loan/wallet',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<CrossCollateralWalletV2ResponseRaw, CrossCollateralWalletV2Response>(
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
