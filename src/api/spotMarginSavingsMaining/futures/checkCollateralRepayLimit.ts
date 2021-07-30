import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CheckCollateralRepayLimitPayload {
  coin: string;
  collateralCoin: string;
}

export interface CheckCollateralRepayLimitResponse {
  coin: string;
  collateralCoin: string;
  max: number;
  min: number;
}

interface CheckCollateralRepayLimitResponseRaw {
  coin: string;
  collateralCoin: string;
  max: string;
  min: string;
}

export async function checkCollateralRepayLimit(
  client: BinanceSignedClient,
  payload: CheckCollateralRepayLimitPayload,
) {
  const response = await apiCall<CheckCollateralRepayLimitResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/collateralRepayLimit',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<CheckCollateralRepayLimitResponseRaw, CheckCollateralRepayLimitResponse>(
    response,
    ({ max, min, ...other }) => ({
      max: parse(max, numberParser),
      min: parse(min, numberParser),
      ...other,
    }),
  );
}
