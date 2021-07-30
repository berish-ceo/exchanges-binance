import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetMaxAmountForAdjustCrossCollateralLTVV2Payload {
  loadCoin: string;
  collateralCoin: string;
}

export interface GetMaxAmountForAdjustCrossCollateralLTVV2Response {
  maxInAmount: number;
  maxOutAmount: number;
}

interface GetMaxAmountForAdjustCrossCollateralLTVV2ResponseRaw {
  maxInAmount: string;
  maxOutAmount: string;
}

export async function getMaxAmountForAdjustCrossCollateralLTVV2(
  client: BinanceSignedClient,
  payload: GetMaxAmountForAdjustCrossCollateralLTVV2Payload,
) {
  const response = await apiCall<GetMaxAmountForAdjustCrossCollateralLTVV2ResponseRaw>({
    host: 'spot',
    path: '/sapi/v2/futures/loan/calcMaxAdjustAmount',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<GetMaxAmountForAdjustCrossCollateralLTVV2ResponseRaw, GetMaxAmountForAdjustCrossCollateralLTVV2Response>(
    response,
    ({ maxInAmount, maxOutAmount, ...other }) => ({
      maxInAmount: parse(maxInAmount, numberParser),
      maxOutAmount: parse(maxOutAmount, numberParser),
      ...other,
    }),
  );
}
