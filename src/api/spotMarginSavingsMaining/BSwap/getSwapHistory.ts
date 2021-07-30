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

export interface GetSwapHistoryPayload {
  swapId?: number;
  startTime?: Date | number;
  endTime?: Date | number;
  status?: 'PENDING' | 'SUCCESS' | 'FAILED';
  quoteAsset?: string;
  baseAsset?: string;
  limit?: number;
}

export interface GetSwapHistoryResponse {
  swapId: number;
  swapTime: Date;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  quoteAsset: string;
  baseAsset: string;
  quoteQty: number;
  baseQty: number;
  price: number;
  fee: number;
}

interface GetSwapHistoryPayloadRaw {
  swapId?: number;
  startTime?: number;
  endTime?: number;
  status?: 0 | 1 | 2;
  quoteAsset?: string;
  baseAsset?: string;
  limit?: number;
}

interface GetSwapHistoryResponseRaw {
  swapId: number;
  swapTime: number;
  status: 0 | 1 | 2;
  quoteAsset: string;
  baseAsset: string;
  quoteQty: number;
  baseQty: number;
  price: number;
  fee: number;
}

export async function getSwapHistory(client: BinanceSignedClient, payload: GetSwapHistoryPayload) {
  const payloadRaw = parse<GetSwapHistoryPayload, GetSwapHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, status, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      status: parse(status, (value) =>
        value === 'PENDING' ? 0 : value === 'SUCCESS' ? 1 : value === 'FAILED' ? 2 : value,
      ),
      ...other,
    }),
  );

  const response = await apiCall<GetSwapHistoryResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/bswap/swap',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<GetSwapHistoryResponseRaw, GetSwapHistoryResponse>(response, ({ swapTime, status, ...other }) => ({
    swapTime: parse(swapTime, dateParser),
    status: parse(status, (value) =>
      value === 0 ? 'PENDING' : value === 1 ? 'SUCCESS' : value === 2 ? 'FAILED' : value,
    ),
    ...other,
  }));
}
