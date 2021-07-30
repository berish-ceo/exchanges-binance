import { BinanceClient, BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  parseOptional,
  dateParser,
} from '@berish/safe-parsing';

export interface MarkPriceResponse {
  symbol: string;
  markPrice: number;
  indexPrice: number;
  lastFundingRate: number;
  nextFundingTime: Date;
  interestRate: number;
  time: Date;
}

interface MarkPriceResponseRaw {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
  interestRate: string;
  time: number;
}

export async function markPrice(client: BinanceClient): Promise<MarkPriceResponse[]>;
export async function markPrice(client: BinanceClient, symbol: string): Promise<MarkPriceResponse>;
export async function markPrice(
  client: BinanceClient,
  symbol?: string,
): Promise<MarkPriceResponse | MarkPriceResponse[]> {
  const response = await apiCall<MarkPriceResponseRaw | MarkPriceResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/premiumIndex',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parseOptional<MarkPriceResponseRaw, MarkPriceResponse>(
    response,
    ({ markPrice, indexPrice, lastFundingRate, nextFundingTime, interestRate, time, ...other }) => ({
      markPrice: parse(markPrice, numberParser),
      indexPrice: parse(indexPrice, numberParser),
      lastFundingRate: parse(lastFundingRate, numberParser),
      nextFundingTime: parse(nextFundingTime, dateParser),
      interestRate: parse(interestRate, numberParser),
      time: parse(time, dateParser),
      ...other,
    }),
  );
}
