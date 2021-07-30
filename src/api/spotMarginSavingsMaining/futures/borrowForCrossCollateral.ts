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

export type BorrowForCrossCollateralPayload = {
  coin: string;
  collateralCount: string;
} & ({ amount: number } | { collateralAmount: number });

export interface BorrowForCrossCollateralResponse {
  coin: string;
  amount: number;
  collateralCoin: string;
  collateralAmount: number;
  time: Date;
  borrowId: string;
}

interface BorrowForCrossCollateralResponseRaw {
  coin: string;
  amount: string;
  collateralCoin: string;
  collateralAmount: string;
  time: number;
  borrowId: string;
}

export async function borrowForCrossCollateral(client: BinanceSignedClient, payload: BorrowForCrossCollateralPayload) {
  const response = await apiCall<BorrowForCrossCollateralResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/borrow',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<BorrowForCrossCollateralResponseRaw, BorrowForCrossCollateralResponse>(
    response,
    ({ amount, collateralAmount, time, ...other }) => ({
      amount: parse(amount, numberParser),
      collateralAmount: parse(collateralAmount, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
