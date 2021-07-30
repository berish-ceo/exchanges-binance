import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface NotionalBracketForSymbolResponse {
  symbol: string;
  brackets: {
    bracket: number;
    initialLeverage: number;
    quantityCap: number;
    quantitylFloor: number;
    maintMarginRatio: number;
  }[];
}

interface NotionalBracketForSymbolResponseRaw {
  symbol: string;
  brackets: {
    bracket: number;
    initialLeverage: number;
    qtyCap: number;
    qtylFloor: number;
    maintMarginRatio: number;
  }[];
}

export async function notionalBracketForSymbol(client: BinanceSignedClient, symbol?: string) {
  const response = await apiCall<NotionalBracketForSymbolResponseRaw[]>({
    host: 'spot',
    path: '/dapi/v2/leverageBracket',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return parseArray<NotionalBracketForSymbolResponseRaw, NotionalBracketForSymbolResponse>(
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
