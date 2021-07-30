import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface CalculateRateAfterAdjustCrossCollateralLTVV2Payload {
  loanCoin: string;
  collateralCoin: string;
  amount: number;
  direction: spot.FuturesDirectionType;
}

export type CalculateRateAfterAdjustCrossCollateralLTVV2Response = number;

interface CalculateRateAfterAdjustCrossCollateralLTVV2ResponseRaw {
  afterCollateralRate: string;
}

export async function calculateRateAfterAdjustCrossCollateralLTVV2(
  client: BinanceSignedClient,
  payload: CalculateRateAfterAdjustCrossCollateralLTVV2Payload,
) {
  const response = await apiCall<CalculateRateAfterAdjustCrossCollateralLTVV2ResponseRaw>({
    host: 'spot',
    path: '/sapi/v2/futures/loan/calcAdjustLevel',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<
    CalculateRateAfterAdjustCrossCollateralLTVV2ResponseRaw,
    CalculateRateAfterAdjustCrossCollateralLTVV2Response
  >(response, ({ afterCollateralRate }) => parse(afterCollateralRate, numberParser));
}
