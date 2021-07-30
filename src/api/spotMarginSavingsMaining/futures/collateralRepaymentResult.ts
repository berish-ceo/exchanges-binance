import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface CollateralRepaymentResultResponse {
  quoteId: string;
  status: string;
}

export async function collateralRepaymentResult(client: BinanceSignedClient, quoteId: string) {
  const response = await apiCall<CollateralRepaymentResultResponse>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/collateralRepayResult',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { quoteId },
  });

  return response;
}
