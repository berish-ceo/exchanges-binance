import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface RemoveLiquidityPayload {
  poolId: number;
  type: 'SINGLE' | 'COMBINATION';
  asset: string;
  shareAmount: number;
}

export type RemoveLiquidityResponse = number;

interface RemoveLiquidityResponseRaw {
  operationId: number;
}

export async function removeLiquidity(client: BinanceSignedClient, payload: RemoveLiquidityPayload) {
  const response = await apiCall<RemoveLiquidityResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/bswap/liquidityRemove',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<RemoveLiquidityResponseRaw, RemoveLiquidityResponse>(response, ({ operationId }) => operationId);
}
