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
import { RefType, usdtM } from '../../../info';
export interface UserAPITradingQuantitativeRulesIndicatorsResponse {
  indicators: {
    pairName: string;

    rules: {
      isLocked: boolean;
      plannedRecoverTime: Date;
      indicator: usdtM.RulesIndicatorType;
      value: number;
      triggerValue: number;
    }[];
  }[];

  updateTime: Date;
}

interface UserAPITradingQuantitativeRulesIndicatorsResponseRaw {
  indicators: {
    [pairName: string]: {
      isLocked: boolean;
      plannedRecoverTime: number;
      indicator: usdtM.RulesIndicatorType;
      value: number;
      triggerValue: number;
    }[];
  };
  updateTime: number;
}

export async function userAPITradingQuantitativeRulesIndicators(client: BinanceSignedClient, symbol?: string) {
  const response = await apiCall<UserAPITradingQuantitativeRulesIndicatorsResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/apiTradingStatus',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { symbol },
  });

  return parse<UserAPITradingQuantitativeRulesIndicatorsResponseRaw, UserAPITradingQuantitativeRulesIndicatorsResponse>(
    response,
    ({ updateTime, indicators, ...other }) => ({
      indicators: parseArray(indicators && Object.entries(indicators), ([pairName, indicators]) => ({
        pairName,
        rules: parseArray(indicators, ({ plannedRecoverTime, ...other }) => ({
          plannedRecoverTime: parse(plannedRecoverTime, dateParser),
          ...other,
        })),
      })),
      updateTime: parse(updateTime, dateParser),
      ...other,
    }),
  );
}
