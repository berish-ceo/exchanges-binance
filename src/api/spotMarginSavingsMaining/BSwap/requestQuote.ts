import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface RequestQuotePayload {
  quoteAsset: string;
  baseAsset: string;
  quoteQty: number;
}

export interface RequestQuoteResponse {
  quoteAsset: string;
  baseAsset: string;
  quoteQty: number;
  baseQty: number;
  price: number;
  slippage: number;
  fee: number;
}

export async function requestQuote(client: BinanceSignedClient, payload: RequestQuotePayload) {
  const response = await apiCall<RequestQuoteResponse>({
    host: 'spot',
    path: '/sapi/v1/bswap/quote',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return response;
}
