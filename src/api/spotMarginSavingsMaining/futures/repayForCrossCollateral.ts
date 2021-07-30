import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface RepayForCrossCollateralPayload {
  coin: string;
  collateralCoin: string;
  amount: number;
}

export interface RepayForCrossCollateralResponse {
  coin: string;
  amount: number;
  collateralCoin: string;
  repayId: string;
}

interface RepayForCrossCollateralResponseRaw {
  coin: string;
  amount: string;
  collateralCoin: string;
  repayId: string;
}

export async function repayForCrossCollateral(client: BinanceSignedClient, payload: RepayForCrossCollateralPayload) {
  const response = await apiCall<RepayForCrossCollateralResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/repay',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<RepayForCrossCollateralResponseRaw, RepayForCrossCollateralResponse>(
    response,
    ({ amount, ...other }) => ({
      amount: parse(amount, numberParser),
      ...other,
    }),
  );
}
