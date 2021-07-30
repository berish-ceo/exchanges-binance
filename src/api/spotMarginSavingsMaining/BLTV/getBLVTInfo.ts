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

export interface GetBLVTInfoResponse {
  tokenName: string;
  description: string;
  underlying: string;
  tokenIssued: number;
  basket: string;
  currentBaskets: {
    symbol: string;
    amount: number;
    notionalValue: number;
  }[];
  nav: number;
  realLeverage: number;
  fundingRate: number;
  dailyManagementFee: number;
  purchaseFeePct: number;
  dailyPurchaseLimit: number;
  redeemFeePct: number;
  dailyRedeemLimit: number;
  timstamp: Date;
}

interface GetBLVTInfoResponseRaw {
  tokenName: string;
  description: string;
  underlying: string;
  tokenIssued: string;
  basket: string;
  currentBaskets: {
    symbol: string;
    amount: string;
    notionalValue: string;
  }[];
  nav: string;
  realLeverage: string;
  fundingRate: string;
  dailyManagementFee: string;
  purchaseFeePct: string;
  dailyPurchaseLimit: string;
  redeemFeePct: string;
  dailyRedeemLimit: string;
  timstamp: number;
}

export async function getBLVTInfo(client: BinanceSignedClient, tokenName?: string) {
  const response = await apiCall<GetBLVTInfoResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/blvt/tokenInfo',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { tokenName },
  });

  return parseArray<GetBLVTInfoResponseRaw, GetBLVTInfoResponse>(
    response,
    ({
      tokenIssued,
      currentBaskets,
      nav,
      realLeverage,
      fundingRate,
      dailyManagementFee,
      purchaseFeePct,
      dailyPurchaseLimit,
      redeemFeePct,
      dailyRedeemLimit,
      timstamp,
      ...other
    }) => ({
      tokenIssued: parse(tokenIssued, numberParser),
      currentBaskets: parseArray(currentBaskets, ({ amount, notionalValue, ...other }) => ({
        amount: parse(amount, numberParser),
        notionalValue: parse(notionalValue, numberParser),
        ...other,
      })),
      nav: parse(nav, numberParser),
      realLeverage: parse(realLeverage, numberParser),
      fundingRate: parse(fundingRate, numberParser),
      dailyManagementFee: parse(dailyManagementFee, numberParser),
      purchaseFeePct: parse(purchaseFeePct, numberParser),
      dailyPurchaseLimit: parse(dailyPurchaseLimit, numberParser),
      redeemFeePct: parse(redeemFeePct, numberParser),
      dailyRedeemLimit: parse(dailyRedeemLimit, numberParser),
      timstamp: parse(timstamp, dateParser),
      ...other,
    }),
  );
}
