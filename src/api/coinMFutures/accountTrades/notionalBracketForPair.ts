import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface NotionalBracketForPairResponse {
  pair: string;
  brackets: {
    bracket: number;
    initialLeverage: number;
    quantityCap: number;
    quantitylFloor: number;
    maintMarginRatio: number;
  }[];
}

interface NotionalBracketForPairResponseRaw {
  pair: string;
  brackets: {
    bracket: number;
    initialLeverage: number;
    qtyCap: number;
    qtylFloor: number;
    maintMarginRatio: number;
  }[];
}

export async function notionalBracketForPair(client: BinanceSignedClient, pair?: string) {
  const response = await apiCall<NotionalBracketForPairResponseRaw[]>({
    host: 'spot',
    path: '/dapi/v1/leverageBracket',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { pair },
  });

  return parseArray<NotionalBracketForPairResponseRaw, NotionalBracketForPairResponse>(
    response,
    ({ brackets, ...other }) => ({
      brackets: parseArray(brackets, ({ qtyCap, qtylFloor, ...other }) => ({
        quantityCap: qtyCap,
        quantitylFloor: qtylFloor,
        ...other,
      })),
      ...other,
    }),
  );
}
