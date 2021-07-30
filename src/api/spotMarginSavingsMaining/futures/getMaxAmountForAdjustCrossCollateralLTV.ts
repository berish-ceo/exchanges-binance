import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
export interface GetMaxAmountForAdjustCrossCollateralLTVResponse {
  maxInAmount: number;
  maxOutAmount: number;
}

interface GetMaxAmountForAdjustCrossCollateralLTVResponseRaw {
  maxInAmount: string;
  maxOutAmount: string;
}

export async function getMaxAmountForAdjustCrossCollateralLTV(client: BinanceSignedClient, collateralCoin: string) {
  const response = await apiCall<GetMaxAmountForAdjustCrossCollateralLTVResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/calcMaxAdjustAmount',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { collateralCoin },
  });

  return parse<GetMaxAmountForAdjustCrossCollateralLTVResponseRaw, GetMaxAmountForAdjustCrossCollateralLTVResponse>(
    response,
    ({ maxInAmount, maxOutAmount, ...other }) => ({
      maxInAmount: parse(maxInAmount, numberParser),
      maxOutAmount: parse(maxOutAmount, numberParser),
      ...other,
    }),
  );
}
