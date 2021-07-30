import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface StatisticListPayload {
  algo: string;
  userName: string;
}

export interface StatisticListResponse {
  fifteenMinHashRate: number;
  dayHashRate: number;
  validNum: number;
  invalidNum: number;
  profitToday: {
    assetName: string;
    value: number;
  }[];

  profitYesterday: {
    assetName: string;
    value: number;
  }[];

  userName: string;
  unit: string;
  algo: string;
}

interface StatisticListResponseRaw {
  code: number;
  msg: string;
  data: {
    fifteenMinHashRate: string;
    dayHashRate: string;
    validNum: number;
    invalidNum: number;
    profitToday: {
      [asset: string]: string;
    };
    profitYesterday: {
      [asset: string]: string;
    };

    userName: string;
    unit: string;
    algo: string;
  };
}

export async function statisticList(client: BinanceSignedClient, payload: StatisticListPayload) {
  const response = await apiCall<StatisticListResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/mining/statistics/user/status',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<StatisticListResponseRaw, StatisticListResponse>(response, ({ data }) =>
    parse(data, ({ fifteenMinHashRate, dayHashRate, profitToday, profitYesterday, ...other }) => ({
      fifteenMinHashRate: parse(fifteenMinHashRate, numberParser),
      dayHashRate: parse(dayHashRate, numberParser),
      profitToday: parseArray(Object.entries(profitToday), ([assetName, value]) => ({
        assetName,
        value: parse(value, numberParser),
      })),
      profitYesterday: parseArray(Object.entries(profitYesterday), ([assetName, value]) => ({
        assetName,
        value: parse(value, numberParser),
      })),
      ...other,
    })),
  );
}
