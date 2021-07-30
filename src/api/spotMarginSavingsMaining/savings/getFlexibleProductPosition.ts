import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetFlexibleProductPositionResponse {
  annualInterestRate: number;
  asset: string;
  avgAnnualInterestRate: number;
  canRedeem: boolean;
  dailyInterestRate: number;
  freeAmount: number;
  freezeAmount: number;
  lockedAmount: number;
  productId: string;
  productName: string;
  redeemingAmount: number;
  todayPurchasedAmount: number;
  totalAmount: number;
  totalInterest: number;
}

interface GetFlexibleProductPositionResponseRaw {
  annualInterestRate: string;
  asset: string;
  avgAnnualInterestRate: string;
  canRedeem: boolean;
  dailyInterestRate: string;
  freeAmount: string;
  freezeAmount: string;
  lockedAmount: string;
  productId: string;
  productName: string;
  redeemingAmount: string;
  todayPurchasedAmount: string;
  totalAmount: string;
  totalInterest: string;
}

export async function getFlexibleProductPosition(client: BinanceSignedClient, asset: string) {
  const response = await apiCall<GetFlexibleProductPositionResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/lending/daily/token/position',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { asset },
  });

  return parseArray<GetFlexibleProductPositionResponseRaw, GetFlexibleProductPositionResponse>(
    response,
    ({
      annualInterestRate,
      avgAnnualInterestRate,
      dailyInterestRate,
      freeAmount,
      freezeAmount,
      lockedAmount,
      redeemingAmount,
      todayPurchasedAmount,
      totalAmount,
      totalInterest,
      ...other
    }) => ({
      annualInterestRate: parse(annualInterestRate, numberParser),
      avgAnnualInterestRate: parse(avgAnnualInterestRate, numberParser),
      dailyInterestRate: parse(dailyInterestRate, numberParser),
      freeAmount: parse(freeAmount, numberParser),
      freezeAmount: parse(freezeAmount, numberParser),
      lockedAmount: parse(lockedAmount, numberParser),
      redeemingAmount: parse(redeemingAmount, numberParser),
      todayPurchasedAmount: parse(todayPurchasedAmount, numberParser),
      totalAmount: parse(totalAmount, numberParser),
      totalInterest: parse(totalInterest, numberParser),
      ...other,
    }),
  );
}
