import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { usdtM } from '../../../info';

export interface PositionInformationPayload {
  marginAsset?: string;
  pair?: string;
}

export interface PositionInformationResponse {
  symbol: string;
  positionAmt: number;
  entryPrice: number;
  markPrice: number;
  unRealizedProfit: number;
  liquidationPrice: number;
  leverage: number;
  maxQuantity: number;
  marginType: usdtM.MarginType;
  isolatedMargin: number;
  isAutoAddMargin: boolean;
  positionSide: usdtM.PositionSide;
}

interface PositionInformationResponseRaw {
  symbol: string;
  positionAmt: string;
  entryPrice: string;
  markPrice: string;
  unRealizedProfit: string;
  liquidationPrice: string;
  leverage: string;
  maxQty: string;
  marginType: usdtM.MarginType;
  isolatedMargin: string;
  isAutoAddMargin: string;
  positionSide: usdtM.PositionSide;
}

export async function positionInformation(client: BinanceSignedClient, payload?: PositionInformationPayload) {
  const response = await apiCall<PositionInformationResponseRaw[]>({
    host: 'spot',
    path: '/dapi/v1/positionRisk',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parseArray<PositionInformationResponseRaw, PositionInformationResponse>(
    response,
    ({
      positionAmt,
      entryPrice,
      markPrice,
      unRealizedProfit,
      liquidationPrice,
      leverage,
      maxQty,
      isolatedMargin,
      isAutoAddMargin,
      ...other
    }) => ({
      positionAmt: parse(positionAmt, numberParser),
      entryPrice: parse(entryPrice, numberParser),
      markPrice: parse(markPrice, numberParser),
      unRealizedProfit: parse(unRealizedProfit, numberParser),
      liquidationPrice: parse(liquidationPrice, numberParser),
      leverage: parse(leverage, numberParser),
      maxQuantity: parse(maxQty, numberParser),
      isolatedMargin: parse(isolatedMargin, numberParser),
      isAutoAddMargin: parse(isAutoAddMargin, boolParser),
      ...other,
    }),
  );
}
