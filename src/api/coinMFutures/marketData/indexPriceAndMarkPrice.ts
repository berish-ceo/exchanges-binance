import { BinanceClient, BinanceSignedClient } from '../../../clients';
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

export interface IndexPriceAndMarkPricePayload {
  symbol?: string;
  pair?: string;
}

export interface IndexPriceAndMarkPriceResponse {
  symbol: string;
  pair: string;
  markPrice: number;
  indexPrice: number;
  estimatedSettlePrice: number;
  lastFundingRate: number;
  interestRate: number;
  nextFundingTime: Date;
  time: Date;
}

interface IndexPriceAndMarkPriceResponseRaw {
  symbol: string;
  pair: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  interestRate: string;
  nextFundingTime: number;
  time: number;
}

export async function indexPriceAndMarkPrice(client: BinanceClient, payload?: IndexPriceAndMarkPricePayload) {
  const response = await apiCall<IndexPriceAndMarkPriceResponseRaw[]>({
    host: 'spot',
    path: '/dapi/v1/premiumIndex',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payload,
  });

  return parseArray<IndexPriceAndMarkPriceResponseRaw, IndexPriceAndMarkPriceResponse>(
    response,
    ({
      markPrice,
      indexPrice,
      estimatedSettlePrice,
      lastFundingRate,
      nextFundingTime,
      interestRate,
      time,
      ...other
    }) => ({
      markPrice: parse(markPrice, numberParser),
      indexPrice: parse(indexPrice, numberParser),
      estimatedSettlePrice: parse(estimatedSettlePrice, numberParser),
      lastFundingRate: parse(lastFundingRate, numberParser),
      nextFundingTime: parse(nextFundingTime, dateParser),
      interestRate: parse(interestRate, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
