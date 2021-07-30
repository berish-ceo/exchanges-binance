import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  dateParser,
} from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface AdjustCrossCollateralLTVV2Payload {
  loanCoin: string;
  collateralCoin: string;
  amount: number;
  direction: spot.FuturesDirectionType;
}

export interface AdjustCrossCollateralLTVV2Response {
  loanCoin: string;
  collateralCoin: string;
  direction: spot.FuturesDirectionType;
  amount: number;
  time: Date;
}

interface AdjustCrossCollateralLTVV2ResponseRaw {
  loanCoin: string;
  collateralCoin: string;
  direction: spot.FuturesDirectionType;
  amount: string;
  time: number;
}

export async function adjustCrossCollateralLTVV2(
  client: BinanceSignedClient,
  payload: AdjustCrossCollateralLTVV2Payload,
) {
  const response = await apiCall<AdjustCrossCollateralLTVV2ResponseRaw>({
    host: 'spot',
    path: '/sapi/v2/futures/loan/adjustCollateral',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<AdjustCrossCollateralLTVV2ResponseRaw, AdjustCrossCollateralLTVV2Response>(
    response,
    ({ amount, time, ...other }) => ({
      amount: parse(amount, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
