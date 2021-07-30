import { BinanceClient, BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  dateParser,
  parseOptional,
} from '@berish/safe-parsing';

export interface CompositeIndexSymbolInformationResponse {
  symbol: string;
  time: Date;
  baseAssetList: {
    baseAsset: string;
    weightInQuantity: number;
    weightInPercentage: number;
  }[];
}

interface CompositeIndexSymbolInformationResponseRaw {
  symbol: string;
  time: number;
  baseAssetList: {
    baseAsset: string;
    weightInQuantity: string;
    weightInPercentage: string;
  }[];
}

export async function compositeIndexSymbolInformation(
  client: BinanceClient,
): Promise<CompositeIndexSymbolInformationResponse[]>;
export async function compositeIndexSymbolInformation(
  client: BinanceClient,
  symbol: string,
): Promise<CompositeIndexSymbolInformationResponse>;
export async function compositeIndexSymbolInformation(
  client: BinanceClient,
  symbol?: string,
): Promise<CompositeIndexSymbolInformationResponse | CompositeIndexSymbolInformationResponse[]> {
  const response = await apiCall<
    CompositeIndexSymbolInformationResponseRaw | CompositeIndexSymbolInformationResponseRaw[]
  >({
    host: 'usdtM',
    path: '/fapi/v1/indexInfo',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: { symbol },
  });

  return parseOptional<CompositeIndexSymbolInformationResponseRaw, CompositeIndexSymbolInformationResponse>(
    response,
    ({ time, baseAssetList, ...other }) => ({
      time: parse(time, dateParser),
      baseAssetList: parseArray(baseAssetList, ({ weightInQuantity, weightInPercentage, ...other }) => ({
        weightInQuantity: parse(weightInQuantity, numberParser),
        weightInPercentage: parse(weightInPercentage, numberParser),
        ...other,
      })),
      ...other,
    }),
  );
}
