import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface AddLiquidityPayload {
  poolId: number;
  asset: string;
  quantity: number;
}

export type AddLiquidityResponse = number;

interface AddLiquidityResponseRaw {
  operationId: number;
}

export async function addLiquidity(client: BinanceSignedClient, payload: AddLiquidityPayload) {
  const response = await apiCall<AddLiquidityResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/bswap/liquidityAdd',
    method: 'POST',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<AddLiquidityResponseRaw, AddLiquidityResponse>(response, ({ operationId }) => operationId);
}
