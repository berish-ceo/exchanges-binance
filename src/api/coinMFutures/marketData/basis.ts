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
import { coinM } from '../../../info';

export interface BasisPayload {
  pair: string;
  contractType: coinM.ContractType;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface BasisResponse {
  pair: string;
  contractType: coinM.ContractType;
  futuresPrice: number;
  indexPrice: number;
  basis: number;
  basisRate: number;
  timestamp: Date;
}

interface BasisPayloadRaw {
  pair: string;
  contractType: coinM.ContractType;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface BasisResponseRaw {
  pair: string;
  contractType: coinM.ContractType;
  futuresPrice: string;
  indexPrice: string;
  basis: string;
  basisRate: string;
  timestamp: number;
}

export async function basis(client: BinanceSignedClient, payload: BasisPayload) {
  const payloadRaw = parse<BasisPayload, BasisPayloadRaw>(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<BasisResponseRaw>({
    host: 'spot',
    path: '/futures/data/basis',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parse<BasisResponseRaw, BasisResponse>(
    response,
    ({ futuresPrice, indexPrice, basis, basisRate, timestamp, ...other }) => ({
      futuresPrice: parse(futuresPrice, numberParser),
      indexPrice: parse(indexPrice, numberParser),
      basis: parse(basis, numberParser),
      basisRate: parse(basisRate, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
