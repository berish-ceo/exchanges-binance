import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface PositionADLQuantileEstimationResponse {
  symbol: string;

  long: number;
  short: number;
  hedge: number;
  both: number;
}

interface PositionADLQuantileEstimationResponseRaw {
  symbol: string;
  adlQuantile: {
    LONG: number;
    SHORT: number;
    BOTH: number;
    HEDGE: number;
  };
}

export async function positionADLQuantileEstimation(client: BinanceSignedClient, symbol?: string) {
  const response = await apiCall<PositionADLQuantileEstimationResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v1/adlQuantile',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return parseArray<PositionADLQuantileEstimationResponseRaw, PositionADLQuantileEstimationResponse>(
    response,
    ({ adlQuantile, ...other }) => ({
      ...other,
      ...parse(adlQuantile, ({ LONG, SHORT, BOTH, HEDGE, ...other }) => ({
        long: LONG,
        short: SHORT,
        hedge: HEDGE,
        both: BOTH,
        ...other,
      })),
    }),
  );
}
