import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface CalculateRateAfterAdjustCrossCollateralLTVPayload {
  collateralCoin: string;
  amount: number;
  direction: spot.FuturesDirectionType;
}

export type CalculateRateAfterAdjustCrossCollateralLTVResponse = number;

interface CalculateRateAfterAdjustCrossCollateralLTVResponseRaw {
  afterCollateralRate: string;
}

export async function calculateRateAfterAdjustCrossCollateralLTV(
  client: BinanceSignedClient,
  payload: CalculateRateAfterAdjustCrossCollateralLTVPayload,
) {
  const response = await apiCall<CalculateRateAfterAdjustCrossCollateralLTVResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/calcAdjustLevel',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<
    CalculateRateAfterAdjustCrossCollateralLTVResponseRaw,
    CalculateRateAfterAdjustCrossCollateralLTVResponse
  >(response, ({ afterCollateralRate }) => parse(afterCollateralRate, numberParser));
}
