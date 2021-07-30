import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
export interface RepayWithCollateralResponse {
  coin: string;
  collateralCoin: string;
  amount: number;
  quoteId: string;
}

interface RepayWithCollateralResponseRaw {
  coin: string;
  collateralCoin: string;
  amount: string;
  quoteId: string;
}

export async function repayWithCollateral(client: BinanceSignedClient, quoteId: string) {
  const response = await apiCall<RepayWithCollateralResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/collateralRepay',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: { quoteId },
  });

  return parse<RepayWithCollateralResponseRaw, RepayWithCollateralResponse>(response, ({ amount, ...other }) => ({
    amount: parse(amount, numberParser),
    ...other,
  }));
}
