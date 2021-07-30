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
import { spot } from '../../../info';

export interface CrossCollateralLiquidationHistoryPayload {
  loanCoin?: string;
  collateralCoin?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface CrossCollateralLiquidationHistoryResponse {
  rows: {
    collateralAmountForLiquidation: number;
    collateralCoin: string;
    forceLiquidationStartTime: Date;
    coin: string;
    restCollateralAmountAfterLiquidation: number;
    restLoanAmount: number;
    status: spot.FuturesCrossCollateralLTVStatus;
  }[];
  total: number;
}

interface CrossCollateralLiquidationHistoryPayloadRaw {
  loanCoin?: string;
  collateralCoin?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface CrossCollateralLiquidationHistoryResponseRaw {
  rows: {
    collateralAmountForLiquidation: string;
    collateralCoin: string;
    forceLiquidationStartTime: number;
    coin: string;
    restCollateralAmountAfterLiquidation: string;
    restLoanAmount: string;
    status: spot.FuturesCrossCollateralLTVStatus;
  }[];
  total: number;
}

export async function crossCollateralLiquidationHistory(
  client: BinanceSignedClient,
  payload: CrossCollateralLiquidationHistoryPayload,
) {
  const payloadRaw = parse<CrossCollateralLiquidationHistoryPayload, CrossCollateralLiquidationHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<CrossCollateralLiquidationHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/liquidationHistory',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<CrossCollateralLiquidationHistoryResponseRaw, CrossCollateralLiquidationHistoryResponse>(
    response,
    ({ rows, ...other }) => ({
      rows: parseArray(
        rows,
        ({
          collateralAmountForLiquidation,
          forceLiquidationStartTime,
          restCollateralAmountAfterLiquidation,
          restLoanAmount,
          ...other
        }) => ({
          collateralAmountForLiquidation: parse(collateralAmountForLiquidation, numberParser),
          forceLiquidationStartTime: parse(forceLiquidationStartTime, dateParser),
          restCollateralAmountAfterLiquidation: parse(restCollateralAmountAfterLiquidation, numberParser),
          restLoanAmount: parse(restLoanAmount, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
