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

export interface AdjustCrossCollateralLTVHistoryPayload {
  loanCoin?: string;
  collateralCoin?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface AdjustCrossCollateralLTVHistoryResponse {
  rows: {
    amount: number;
    collateralCoin: string;
    coin: string;
    preCollateralRate: number;
    afterCollateralRate: number;
    direction: spot.FuturesDirectionType;
    status: spot.FuturesCrossCollateralLTVStatus;
    adjustTime: Date;
  }[];
  total: number;
}

interface AdjustCrossCollateralLTVHistoryPayloadRaw {
  loanCoin?: string;
  collateralCoin?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface AdjustCrossCollateralLTVHistoryResponseRaw {
  rows: {
    amount: string;
    collateralCoin: string;
    coin: string;
    preCollateralRate: string;
    afterCollateralRate: string;
    direction: spot.FuturesDirectionType;
    status: spot.FuturesCrossCollateralLTVStatus;
    adjustTime: number;
  }[];
  total: number;
}

export async function adjustCrossCollateralLTVHistory(
  client: BinanceSignedClient,
  payload: AdjustCrossCollateralLTVHistoryPayload,
) {
  const payloadRaw = parse<AdjustCrossCollateralLTVHistoryPayload, AdjustCrossCollateralLTVHistoryPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<AdjustCrossCollateralLTVHistoryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/futures/loan/adjustCollateral/history',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  return parse<AdjustCrossCollateralLTVHistoryResponseRaw, AdjustCrossCollateralLTVHistoryResponse>(
    response,
    ({ rows, ...other }) => ({
      rows: parseArray(rows, ({ amount, preCollateralRate, afterCollateralRate, adjustTime, ...other }) => ({
        amount: parse(amount, numberParser),
        preCollateralRate: parse(preCollateralRate, numberParser),
        afterCollateralRate: parse(afterCollateralRate, numberParser),
        adjustTime: parse(adjustTime, dateParser),
        ...other,
      })),
      ...other,
    }),
  );
}
