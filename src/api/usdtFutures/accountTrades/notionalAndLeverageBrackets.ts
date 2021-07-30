import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import {
  parseArray,
  parse,
  boolParser,
  regExpParser,
  stringParser,
  numberParser,
  parseOptional,
} from '@berish/safe-parsing';

export interface NotionalAndLeverageBracketsResponse {
  symbol: string;
  brackets: {
    bracket: number;
    initialLeverage: number;
    notionalCap: number;
    notionalFloor: number;
    maintMarginRatio: number;
    cum: number;
  }[];
}
export async function notionalAndLeverageBrackets(
  client: BinanceSignedClient,
): Promise<NotionalAndLeverageBracketsResponse[]>;
export async function notionalAndLeverageBrackets(
  client: BinanceSignedClient,
  symbol: string,
): Promise<NotionalAndLeverageBracketsResponse>;
export async function notionalAndLeverageBrackets(
  client: BinanceSignedClient,
  symbol?: string,
): Promise<NotionalAndLeverageBracketsResponse | NotionalAndLeverageBracketsResponse[]> {
  const response = await apiCall<NotionalAndLeverageBracketsResponse | NotionalAndLeverageBracketsResponse[]>({
    host: 'usdtM',
    path: '/fapi/v1/leverageBracket',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return response;
}
