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

export interface HistoricalBLVTNAVKlineCandlestickPayload {
  symbol: string;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface HistoricalBLVTNAVKlineCandlestickResponse {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  realLeverage: number;
  closeTime: Date;
  numberOfNAVUpdate: number;
}

interface HistoricalBLVTNAVKlineCandlestickPayloadRaw {
  symbol: string;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

type HistoricalBLVTNAVKlineCandlestickResponseRaw = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

export async function historicalBLVTNAVKlineCandlestick(
  client: BinanceClient,
  payload: HistoricalBLVTNAVKlineCandlestickPayload,
) {
  const payloadRaw = parse<HistoricalBLVTNAVKlineCandlestickPayload, HistoricalBLVTNAVKlineCandlestickPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<HistoricalBLVTNAVKlineCandlestickResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/lvtKlines',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parse<HistoricalBLVTNAVKlineCandlestickResponseRaw, HistoricalBLVTNAVKlineCandlestickResponse>(
    response,
    ([
      openTime,
      open,
      high,
      low,
      close,
      realLeverage,
      closeTime,
      ignore_1,
      numberOfNAVUpdate,
      ignore_2,
      ignore_3,
      ignore_4,
    ]) => ({
      openTime: parse(openTime, dateParser),
      open: parse(open, numberParser),
      high: parse(high, numberParser),
      low: parse(low, numberParser),
      close: parse(close, numberParser),
      realLeverage: parse(realLeverage, numberParser),
      closeTime: parse(closeTime, dateParser),
      numberOfNAVUpdate: parse(numberOfNAVUpdate, numberParser),
    }),
  );
}
