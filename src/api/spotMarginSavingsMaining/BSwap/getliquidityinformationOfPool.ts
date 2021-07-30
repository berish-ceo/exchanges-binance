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
export interface GetliquidityinformationOfPoolResponse {
  poolId: number;
  poolName: string;
  updateTime: Date;
  liquidity: {
    BUSD: number;
    USDT: number;
  };
  share: {
    shareAmount: number;
    sharePercentage: number;
    asset: {
      BUSD: number;
      USDT: number;
    };
  };
}

interface GetliquidityinformationOfPoolResponseRaw {
  poolId: number;
  poolName: string;
  updateTime: number;
  liquidity: {
    BUSD: number;
    USDT: number;
  };
  share: {
    shareAmount: number;
    sharePercentage: number;
    asset: {
      BUSD: number;
      USDT: number;
    };
  };
}

export async function getliquidityinformationOfPool(client: BinanceSignedClient, poolId?: number) {
  const response = await apiCall<GetliquidityinformationOfPoolResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/bswap/liquidity',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { poolId },
  });

  return parse<GetliquidityinformationOfPoolResponseRaw, GetliquidityinformationOfPoolResponse>(
    response,
    ({ updateTime, ...other }) => ({
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
