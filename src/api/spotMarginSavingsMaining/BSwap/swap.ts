import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface SwapPayload {
  quoteAsset: string;
  baseAsset: string;
  quoteQty: number;
}

export type SwapResponse = number;

interface SwapResponseRaw {
  swapId: number;
}

export async function swap(client: BinanceSignedClient, payload: SwapPayload) {
  const response = await apiCall<SwapResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/bswap/swap',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<SwapResponseRaw, SwapResponse>(response, ({ swapId }) => swapId);
}
