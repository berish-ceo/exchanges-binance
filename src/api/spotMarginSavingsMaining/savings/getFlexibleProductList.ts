import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface GetFlexibleProductListPayload {
  status?: spot.FlexibleProductStatusType;
  featured?: 'ALL' | 'true';
}

export interface GetFlexibleProductListResponse {
  asset: string;
  avgAnnualInterestRate: number;
  canPurchase: boolean;
  canRedeem: boolean;
  dailyInterestPerThousand: number;
  featured: boolean;
  minPurchaseAmount: number;
  productId: string;
  purchasedAmount: number;
  status: spot.FlexibleProductStatusType;
  upLimit: number;
  upLimitPerUser: number;
}

interface GetFlexibleProductListResponseRaw {
  asset: string;
  avgAnnualInterestRate: string;
  canPurchase: boolean;
  canRedeem: boolean;
  dailyInterestPerThousand: string;
  featured: boolean;
  minPurchaseAmount: string;
  productId: string;
  purchasedAmount: string;
  status: spot.FlexibleProductStatusType;
  upLimit: string;
  upLimitPerUser: string;
}

export async function getFlexibleProductList(client: BinanceSignedClient, payload?: GetFlexibleProductListPayload) {
  const response = await apiCall<GetFlexibleProductListResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/lending/daily/product/list',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parseArray<GetFlexibleProductListResponseRaw, GetFlexibleProductListResponse>(
    response,
    ({
      avgAnnualInterestRate,
      dailyInterestPerThousand,
      minPurchaseAmount,
      purchasedAmount,
      upLimit,
      upLimitPerUser,
      ...other
    }) => ({
      avgAnnualInterestRate: parse(avgAnnualInterestRate, numberParser),
      dailyInterestPerThousand: parse(dailyInterestPerThousand, numberParser),
      minPurchaseAmount: parse(minPurchaseAmount, numberParser),
      purchasedAmount: parse(purchasedAmount, numberParser),
      upLimit: parse(upLimit, numberParser),
      upLimitPerUser: parse(upLimitPerUser, numberParser),
      ...other,
    }),
  );
}
