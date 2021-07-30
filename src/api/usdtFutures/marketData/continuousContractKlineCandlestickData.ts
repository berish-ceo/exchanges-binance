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

export interface ContinuousContractKlineCandlestickDataPayload {
  pair: string;
  contractType: usdtM.ContractType;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: Date | number;
  endTime?: Date | number;
}

export interface ContinuousContractKlineCandlestickDataResponse {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: Date;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

interface ContinuousContractKlineCandlestickDataPayloadRaw {
  pair: string;
  contractType: usdtM.ContractType;
  interval: usdtM.KlineCandlestickChartIntervals;
  startTime?: number;
  endTime?: number;
}

type ContinuousContractKlineCandlestickDataResponseRaw = [
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

export async function continuousContractKlineCandlestickData(
  client: BinanceClient,
  payload: ContinuousContractKlineCandlestickDataPayload,
) {
  const payloadRaw = parse<
    ContinuousContractKlineCandlestickDataPayload,
    ContinuousContractKlineCandlestickDataPayloadRaw
  >(payload, ({ startTime, endTime, ...other }) => ({
    startTime: parse(startTime, numberParser),
    endTime: parse(endTime, numberParser),
    ...other,
  }));

  const response = await apiCall<ContinuousContractKlineCandlestickDataResponseRaw>({
    host: 'usdtM',
    path: '/fapi/v1/continuousKlines',
    method: 'GET',
    securityType: 'NONE',

    client,
    data: payloadRaw,
  });

  return parse<ContinuousContractKlineCandlestickDataResponseRaw, ContinuousContractKlineCandlestickDataResponse>(
    response,
    ([
      openTime,
      open,
      high,
      low,
      close,
      volume,
      closeTime,
      quoteAssetVolume,
      numberOfTrades,
      takerBuyBaseAssetVolume,
      takerBuyQuoteAssetVolume,
      ignore,
    ]) => ({
      openTime: parse(openTime, dateParser),
      open: parse(open, numberParser),
      high: parse(high, numberParser),
      low: parse(low, numberParser),
      close: parse(close, numberParser),
      volume: parse(volume, numberParser),
      closeTime: parse(closeTime, dateParser),
      quoteAssetVolume: parse(quoteAssetVolume, numberParser),
      numberOfTrades: parse(numberOfTrades, numberParser),
      takerBuyBaseAssetVolume: parse(takerBuyBaseAssetVolume, numberParser),
      takerBuyQuoteAssetVolume: parse(takerBuyQuoteAssetVolume, numberParser),
    }),
  );
}
