import { BinanceClient, BinanceSignedClient } from '../../../clients';
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
import { usdtM } from '../../../info';

export interface TakerBuySellVolumePayload {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface TakerBuySellVolumeResponse {
  buySellRatio: number;
  buyVol: number;
  sellVol: number;
  timestamp: Date;
}

interface TakerBuySellVolumePayloadRaw {
  symbol: string;
  period: usdtM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface TakerBuySellVolumeResponseRaw {
  buySellRatio: string;
  buyVol: string;
  sellVol: string;
  timestamp: string;
}

export async function takerBuySellVolume(client: BinanceClient, payload: TakerBuySellVolumePayload) {
  const payloadRaw = parse<TakerBuySellVolumePayload, TakerBuySellVolumePayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<TakerBuySellVolumeResponseRaw[]>({
    host: 'usdtM',
    path: '/futures/data/takerlongshortRatio',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parseArray<TakerBuySellVolumeResponseRaw, TakerBuySellVolumeResponse>(
    response,
    ({ buySellRatio, buyVol, sellVol, timestamp, ...other }) => ({
      buySellRatio: parse(buySellRatio, numberParser),
      buyVol: parse(buyVol, numberParser),
      sellVol: parse(sellVol, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
