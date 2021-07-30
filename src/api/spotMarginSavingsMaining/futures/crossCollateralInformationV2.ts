import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CrossCollateralInformationV2Payload {
  loadCoin?: string;
  collateralCoin?: string;
}

export interface CrossCollateralInformationV2Response {
  loanCoin: string;
  collateralCoin: string;
  rate: number;
  marginCallCollateralRate: number;
  liquidationCollateralRate: number;
  currentCollateralRate: number;
  interestRate: number;
  interestGracePeriod: number;
}

interface CrossCollateralInformationV2ResponseRaw {
  loanCoin: string;
  collateralCoin: string;
  rate: string;
  marginCallCollateralRate: string;
  liquidationCollateralRate: string;
  currentCollateralRate: string;
  interestRate: string;
  interestGracePeriod: string;
}

export async function crossCollateralInformationV2(
  client: BinanceSignedClient,
  payload?: CrossCollateralInformationV2Payload,
) {
  const response = await apiCall<CrossCollateralInformationV2ResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v2/futures/loan/configs',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parseArray<CrossCollateralInformationV2ResponseRaw, CrossCollateralInformationV2Response>(
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
