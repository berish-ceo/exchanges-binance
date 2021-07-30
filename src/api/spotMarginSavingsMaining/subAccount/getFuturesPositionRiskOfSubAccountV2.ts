import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';
import { spot } from '../../../info';

export interface GetFuturesPositionRiskOfSubAccountV2Payload<FuturesType extends spot.FuturesTypeEnum> {
  email: string;
  futuresType: FuturesType;
}

export interface GetFuturesPositionRiskOfSubAccountV2USDTResponse {
  entryPrice: number;
  leverage: number;
  maxNotional: number;
  liquidationPrice: number;
  markPrice: number;
  positionAmount: number;
  symbol: string;
  unrealizedProfit: number;
}

interface GetFuturesPositionRiskOfSubAccountV2USDTResponseRaw {
  futurePositionRiskVOS: {
    entryPrice: string;
    leverage: string;
    maxNotional: string;
    liquidationPrice: string;
    markPrice: string;
    positionAmount: string;
    symbol: string;
    unrealizedProfit: string;
  }[];
}

export interface GetFuturesPositionRiskOfSubAccountV2CoinResponse {
  entryPrice: number;
  markPrice: number;
  leverage: number;
  isolated: boolean;
  isolatedWallet: number;
  isolatedMargin: number;
  isAutoAddMargin: boolean;
  positionSide: string;
  positionAmount: number;
  symbol: string;
  unrealizedProfit: number;
}

interface GetFuturesPositionRiskOfSubAccountV2CoinResponseRaw {
  deliveryPositionRiskVOS: {
    entryPrice: string;
    markPrice: string;
    leverage: string;
    isolated: string;
    isolatedWallet: string;
    isolatedMargin: string;
    isAutoAddMargin: string;
    positionSide: string;
    positionAmount: string;
    symbol: string;
    unrealizedProfit: string;
  }[];
}

export async function getFuturesPositionRiskOfSubAccountV2(
  client: BinanceSignedClient,
  payload: GetFuturesPositionRiskOfSubAccountV2Payload<spot.FuturesTypeEnum.USDT_MARGINED_FUTURES>,
): Promise<GetFuturesPositionRiskOfSubAccountV2USDTResponse[]>;
export async function getFuturesPositionRiskOfSubAccountV2(
  client: BinanceSignedClient,
  payload: GetFuturesPositionRiskOfSubAccountV2Payload<spot.FuturesTypeEnum.COIN_MARGINED_FUTURES>,
): Promise<GetFuturesPositionRiskOfSubAccountV2CoinResponse[]>;
export async function getFuturesPositionRiskOfSubAccountV2(
  client: BinanceSignedClient,
  payload: GetFuturesPositionRiskOfSubAccountV2Payload<spot.FuturesTypeEnum>,
): Promise<GetFuturesPositionRiskOfSubAccountV2USDTResponse[] | GetFuturesPositionRiskOfSubAccountV2CoinResponse[]>;
export async function getFuturesPositionRiskOfSubAccountV2(
  client: BinanceSignedClient,
  payload: GetFuturesPositionRiskOfSubAccountV2Payload<spot.FuturesTypeEnum>,
): Promise<GetFuturesPositionRiskOfSubAccountV2USDTResponse[] | GetFuturesPositionRiskOfSubAccountV2CoinResponse[]> {
  const response = await apiCall<
    GetFuturesPositionRiskOfSubAccountV2USDTResponseRaw | GetFuturesPositionRiskOfSubAccountV2CoinResponseRaw
  >({
    host: 'spot',
    path: '/sapi/v2/sub-account/futures/positionRisk',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  if (payload.futuresType === spot.FuturesTypeEnum.USDT_MARGINED_FUTURES) {
    return parse<
      GetFuturesPositionRiskOfSubAccountV2USDTResponseRaw,
      GetFuturesPositionRiskOfSubAccountV2USDTResponse[]
    >(response as GetFuturesPositionRiskOfSubAccountV2USDTResponseRaw, ({ futurePositionRiskVOS }) =>
      parseArray(
        futurePositionRiskVOS,
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
      ),
    );
  }

  if (payload.futuresType === spot.FuturesTypeEnum.COIN_MARGINED_FUTURES) {
    return parse<
      GetFuturesPositionRiskOfSubAccountV2CoinResponseRaw,
      GetFuturesPositionRiskOfSubAccountV2CoinResponse[]
    >(response as GetFuturesPositionRiskOfSubAccountV2CoinResponseRaw, ({ deliveryPositionRiskVOS }) =>
      parseArray(
        deliveryPositionRiskVOS,
        ({
          entryPrice,
          markPrice,
          leverage,
          isolated,
          isolatedWallet,
          isolatedMargin,
          isAutoAddMargin,
          positionAmount,
          unrealizedProfit,
          ...other
        }) => ({
          entryPrice: parse(entryPrice, numberParser),
          markPrice: parse(markPrice, numberParser),
          leverage: parse(leverage, numberParser),
          isolated: parse(isolated, boolParser),
          isolatedWallet: parse(isolatedWallet, numberParser),
          isolatedMargin: parse(isolatedMargin, numberParser),
          isAutoAddMargin: parse(isAutoAddMargin, boolParser),
          positionAmount: parse(positionAmount, numberParser),
          unrealizedProfit: parse(unrealizedProfit, numberParser),
          ...other,
        }),
      ),
    );
  }

  return null;
}
