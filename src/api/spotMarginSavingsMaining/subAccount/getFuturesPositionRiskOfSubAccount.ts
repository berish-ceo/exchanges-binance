import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetFuturesPositionRiskOfSubAccountResponse {
  entryPrice: number;
  leverage: number;
  maxNotional: number;
  liquidationPrice: number;
  markPrice: number;
  positionAmount: number;
  symbol: string;
  unrealizedProfit: number;
}

interface GetFuturesPositionRiskOfSubAccountResponseRaw {
  entryPrice: string;
  leverage: string;
  maxNotional: string;
  liquidationPrice: string;
  markPrice: string;
  positionAmount: string;
  symbol: string;
  unrealizedProfit: string;
}

export async function getFuturesPositionRiskOfSubAccount(client: BinanceSignedClient, email: string) {
  const response = await apiCall<GetFuturesPositionRiskOfSubAccountResponseRaw[]>({
    host: 'spot',
    path: '/sapi/v1/sub-account/futures/positionRisk',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { email },
  });

  return parseArray<GetFuturesPositionRiskOfSubAccountResponseRaw, GetFuturesPositionRiskOfSubAccountResponse>(
    response,
    ({
      entryPrice,
      leverage,
      maxNotional,
      liquidationPrice,
      markPrice,
      positionAmount,
      unrealizedProfit,
      ...other
    }) => ({
      entryPrice: parse(entryPrice, numberParser),
      leverage: parse(leverage, numberParser),
      maxNotional: parse(maxNotional, numberParser),
      liquidationPrice: parse(liquidationPrice, numberParser),
      markPrice: parse(markPrice, numberParser),
      positionAmount: parse(positionAmount, numberParser),
      unrealizedProfit: parse(unrealizedProfit, numberParser),
      ...other,
    }),
  );
}
