import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
export interface CrossCollateralInformationResponse {
  collateralCoin: string;
  rate: number;
  marginCallCollateralRate: number;
  liquidationCollateralRate: number;
  currentCollateralRate: number;
  interestRate: number;
  interestGracePeriod: number;
}

interface CrossCollateralInformationResponseRaw {
  collateralCoin: string;
  rate: string;
  marginCallCollateralRate: string;
  liquidationCollateralRate: string;
  currentCollateralRate: string;
  interestRate: string;
  interestGracePeriod: string;
}

export async function crossCollateralInformation(client: BinanceSignedClient, collateralCoin?: string) {
  const response = await apiCall<CrossCollateralInformationResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/configs',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { collateralCoin },
  });

  return parseArray<CrossCollateralInformationResponseRaw, CrossCollateralInformationResponse>(
    response,
    ({
      rate,
      marginCallCollateralRate,
      liquidationCollateralRate,
      currentCollateralRate,
      interestRate,
      interestGracePeriod,
      ...other
    }) => ({
      rate: parse(rate, numberParser),
      marginCallCollateralRate: parse(marginCallCollateralRate, numberParser),
      liquidationCollateralRate: parse(liquidationCollateralRate, numberParser),
      currentCollateralRate: parse(currentCollateralRate, numberParser),
      interestRate: parse(interestRate, numberParser),
      interestGracePeriod: parse(interestGracePeriod, numberParser),
      ...other,
    }),
  );
}
