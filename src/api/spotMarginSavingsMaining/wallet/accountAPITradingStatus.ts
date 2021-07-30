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

export interface AccountAPITradingStatusResponse {
  isLocked: boolean;
  plannedRecoverTime: number;
  triggerCondition: {
    GCR: number;
    IFER: number;
    UFR: number;
  };
  indicators: {
    pairName: string;

    rules: {
      indicator: spot.RulesIndicatorType;
      countOrders: number;
      currentTypeValue: number;
      triggerTypeValue: number;
    }[];
  }[];
  updateTime: Date;
}

interface AccountAPITradingStatusResponseRaw {
  data: {
    isLocked: boolean;
    plannedRecoverTime: number;
    triggerCondition: {
      GCR: number;
      IFER: number;
      UFR: number;
    };
    indicators: {
      [pairName: string]: {
        i: spot.RulesIndicatorType;
        c: number;
        v: number;
        t: number;
      }[];
    };
    updateTime: number;
  };
}

export async function accountAPITradingStatus(client: BinanceSignedClient) {
  const response = await apiCall<AccountAPITradingStatusResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/account/apiTradingStatus',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
  });

  return parse<AccountAPITradingStatusResponseRaw, AccountAPITradingStatusResponse>(
    response,
    ({ data, ...rootOther }) =>
      parse(data, ({ updateTime, indicators, ...other }) => ({
        ...rootOther,

        updateTime: parse(updateTime, dateParser),
        indicators: parseArray(indicators && Object.entries(indicators), ([pairName, indicators]) => ({
          pairName,
          rules: parseArray(indicators, ({ i, c, v, t, ...other }) => ({
            indicator: i,
            countOrders: c,
            currentTypeValue: v,
            triggerTypeValue: t,
            ...other,
          })),
        })),
        ...other,
      })),
  );
}
