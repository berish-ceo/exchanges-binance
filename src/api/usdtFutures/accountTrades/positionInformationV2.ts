import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { usdtM } from '../../../info';
export interface PositionInformationV2Response {
  entryPrice: number;
  marginType: usdtM.MarginType;
  isAutoAddMargin: boolean;
  isolatedMargin: number;
  leverage: number;
  liquidationPrice: number;
  markPrice: number;
  maxNotionalValue: number;
  positionAmt: number;
  symbol: string;
  unRealizedProfit: number;
  positionSide: usdtM.PositionSide;
}

interface PositionInformationV2ResponseRaw {
  entryPrice: string;
  marginType: 'isolated' | 'cross';
  isAutoAddMargin: string;
  isolatedMargin: string;
  leverage: string;
  liquidationPrice: string;
  markPrice: string;
  maxNotionalValue: string;
  positionAmt: string;
  symbol: string;
  unRealizedProfit: string;
  positionSide: usdtM.PositionSide;
}

export async function positionInformationV2(client: BinanceSignedClient, symbol?: string) {
  const response = await apiCall<PositionInformationV2ResponseRaw[]>({
    host: 'usdtM',
    path: '/fapi/v2/positionRisk',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return parseArray<PositionInformationV2ResponseRaw, PositionInformationV2Response>(
    response,
    ({
      entryPrice,
      isAutoAddMargin,
      marginType,
      isolatedMargin,
      leverage,
      liquidationPrice,
      markPrice,
      maxNotionalValue,
      positionAmt,
      unRealizedProfit,
      ...other
    }) => ({
      entryPrice: parse(entryPrice, numberParser),
      isAutoAddMargin: parse(isAutoAddMargin, boolParser),
      isolatedMargin: parse(isolatedMargin, numberParser),
      leverage: parse(leverage, numberParser),
      liquidationPrice: parse(liquidationPrice, numberParser),
      markPrice: parse(markPrice, numberParser),
      maxNotionalValue: parse(maxNotionalValue, numberParser),
      positionAmt: parse(positionAmt, numberParser),
      unRealizedProfit: parse(unRealizedProfit, numberParser),
      marginType: marginType === 'isolated' ? 'ISOLATED' : 'CROSSED',
      ...other,
    }),
  );
}
