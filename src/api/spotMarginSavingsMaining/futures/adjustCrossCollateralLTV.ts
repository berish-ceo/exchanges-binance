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

export interface AdjustCrossCollateralLTVPayload {
  collateralCoin: string;
  amount: number;
  direction: spot.FuturesDirectionType;
}

export interface AdjustCrossCollateralLTVResponse {
  collateralCoin: string;
  direction: spot.FuturesDirectionType;
  amount: number;
  time: Date;
}

interface AdjustCrossCollateralLTVResponseRaw {
  collateralCoin: string;
  direction: spot.FuturesDirectionType;
  amount: string;
  time: number;
}

export async function adjustCrossCollateralLTV(client: BinanceSignedClient, payload: AdjustCrossCollateralLTVPayload) {
  const response = await apiCall<AdjustCrossCollateralLTVResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/adjustCollateral',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<AdjustCrossCollateralLTVResponseRaw, AdjustCrossCollateralLTVResponse>(
    response,
    ({ amount, time, ...other }) => ({
      amount: parse(amount, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
