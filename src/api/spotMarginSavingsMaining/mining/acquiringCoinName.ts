import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface AcquiringCoinNameResponse {
  coinName: string;
  coinId: number;
  poolIndex: number;
  algoId: number;
  algoName: string;
}

interface AcquiringCoinNameResponseRaw {
  code: number;
  msg: string;
  data: {
    coinName: string;
    coinId: number;
    poolIndex: number;
    algoId: number;
    algoName: string;
  }[];
}

export async function acquiringCoinName(client: BinanceSignedClient) {
  const response = await apiCall<AcquiringCoinNameResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/pub/coinList',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<AcquiringCoinNameResponseRaw, AcquiringCoinNameResponse[]>(response, ({ data }) =>
    parseArray(data, ({ ...other }) => ({ ...other })),
  );
}
