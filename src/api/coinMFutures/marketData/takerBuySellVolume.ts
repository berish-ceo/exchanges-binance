import { BinanceClient, BinanceKeyClient, BinanceSignedClient } from '../../../clients';
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
import { coinM } from '../../../info';

export interface TakerBuySellVolumePayload {
  pair: string;
  contractType: coinM.ContractType;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface TakerBuySellVolumeResponse {
  pair: string;
  contractType: coinM.ContractType;
  takerBuyVol: number;
  takerSellVol: number;
  takerBuyVolValue: number;
  takerSellVolValue: number;
  timestamp: Date;
}

interface TakerBuySellVolumePayloadRaw {
  pair: string;
  contractType: coinM.ContractType;
  period: coinM.InterestPeriod;
  limit?: number;
  startTime?: number;
  endTime?: number;
}

interface TakerBuySellVolumeResponseRaw {
  pair: string;
  contractType: coinM.ContractType;
  takerBuyVol: string;
  takerSellVol: string;
  takerBuyVolValue: string;
  takerSellVolValue: string;
  timestamp: number;
}

export async function takerBuySellVolume(client: BinanceKeyClient, payload: TakerBuySellVolumePayload) {
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
    path: '/futures/data/takerBuySellVol',
    method: 'GET',
    securityType: 'MARKET_DATA',

    client,
    data: payloadRaw,
  });

  return parseArray<TakerBuySellVolumeResponseRaw, TakerBuySellVolumeResponse>(
    response,
    ({ takerBuyVol, takerSellVol, takerBuyVolValue, takerSellVolValue, timestamp, ...other }) => ({
      takerBuyVol: parse(takerBuyVol, numberParser),
      takerSellVol: parse(takerSellVol, numberParser),
      takerBuyVolValue: parse(takerBuyVolValue, numberParser),
      takerSellVolValue: parse(takerSellVolValue, numberParser),
      timestamp: parse(timestamp, dateParser),
      ...other,
    }),
  );
}
