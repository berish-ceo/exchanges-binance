import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface AcquiringAlgorithmResponse {
  algoName: string;
  algoId: number;
  poolIndex: number;
  unit: string;
}

interface AcquiringAlgorithmResponseRaw {
  code: number;
  msg: string;
  data: {
    algoName: string;
    algoId: number;
    poolIndex: number;
    unit: string;
  }[];
}

export async function acquiringAlgorithm(client: BinanceSignedClient) {
  const response = await apiCall<AcquiringAlgorithmResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/pub/algoList',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<AcquiringAlgorithmResponseRaw, AcquiringAlgorithmResponse[]>(response, ({ data }) =>
    parseArray(data, ({ ...other }) => ({ ...other })),
  );
}
