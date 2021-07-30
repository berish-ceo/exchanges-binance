import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetCollateralRepayQuotePayload {
  coin: string;
  collateralCoin: string;
  amount: number;
}

export interface GetCollateralRepayQuoteResponse {
  coin: string;
  collateralCoin: string;
  amount: number;
  quoteId: string;
}

interface GetCollateralRepayQuoteResponseRaw {
  coin: string;
  collateralCoin: string;
  amount: string;
  quoteId: string;
}

export async function getCollateralRepayQuote(client: BinanceSignedClient, payload: GetCollateralRepayQuotePayload) {
  const response = await apiCall<GetCollateralRepayQuoteResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/collateralRepay',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<GetCollateralRepayQuoteResponseRaw, GetCollateralRepayQuoteResponse>(
    response,
    ({ amount, ...other }) => ({
      amount: parse(amount, numberParser),
      ...other,
    }),
  );
}
