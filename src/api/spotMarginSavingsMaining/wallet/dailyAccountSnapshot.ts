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
import { BinanceError, RefType, spot } from '../../../info';

export interface DailyAccountSnapshotPayload<PayloadType extends spot.DailyAccountSnapshotType> {
  type: PayloadType;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
}

export interface DailyAccountSnapshotSpotResponse {
  data: {
    balances: {
      asset: string;
      free: number;
      locked: number;
    }[];
    totalAssetOfBtc: number;
  };
  type: RefType<spot.DailyAccountSnapshotType, 'SPOT'>;
  updateTime: Date;
}
export interface DailyAccountSnapshotMarginResponse {
  data: {
    marginLevel: number;
    totalAssetOfBtc: number;
    totalLiabilityOfBtc: number;
    totalNetAssetOfBtc: number;
    userAssets: {
      asset: string;
      borrowed: number;
      free: number;
      interest: number;
      locked: number;
      netAsset: number;
    }[];
  };
  type: RefType<spot.DailyAccountSnapshotType, 'MARGIN'>;
  updateTime: Date;
}

export interface DailyAccountSnapshotFuturesResponse {
  data: {
    assets: {
      asset: string;
      marginBalance: number;
      walletBalance: number;
    }[];
    position: {
      entryPrice: number;
      markPrice: number;
      positionAmt: number;
      symbol: string;
      unRealizedProfit: number;
    }[];
  };
  type: RefType<spot.DailyAccountSnapshotType, 'FUTURES'>;
  updateTime: Date;
}

interface DailyAccountSnapshotPayloadRaw {
  type: spot.DailyAccountSnapshotType;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

interface DailyAccountSnapshotSpotResponseRaw {
  code: number;
  msg: string;
  snapshotVos: {
    data: {
      balances: {
        asset: string;
        free: string;
        locked: string;
      }[];
      totalAssetOfBtc: string;
    };
    type: 'spot';
    updateTime: number;
  }[];
}

interface DailyAccountSnapshotMarginResponseRaw {
  code: number;
  msg: string;
  snapshotVos: {
    data: {
      marginLevel: string;
      totalAssetOfBtc: string;
      totalLiabilityOfBtc: string;
      totalNetAssetOfBtc: string;
      userAssets: {
        asset: string;
        borrowed: string;
        free: string;
        interest: string;
        locked: string;
        netAsset: string;
      }[];
    };
    type: 'margin';
    updateTime: number;
  }[];
}

interface DailyAccountSnapshotFuturesResponseRaw {
  code: number;
  msg: string;
  snapshotVos: {
    data: {
      assets: {
        asset: string;
        marginBalance: string;
        walletBalance: string;
      }[];
      position: {
        entryPrice: string;
        markPrice: string;
        positionAmt: string;
        symbol: string;
        unRealizedProfit: string;
      }[];
    };
    type: 'futures';
    updateTime: number;
  }[];
}

export async function dailyAccountSnapshot(
  client: BinanceSignedClient,
  payload: DailyAccountSnapshotPayload<'SPOT'>,
): Promise<DailyAccountSnapshotSpotResponse[]>;
export async function dailyAccountSnapshot(
  client: BinanceSignedClient,
  payload: DailyAccountSnapshotPayload<'MARGIN'>,
): Promise<DailyAccountSnapshotMarginResponse[]>;
export async function dailyAccountSnapshot(
  client: BinanceSignedClient,
  payload: DailyAccountSnapshotPayload<'FUTURES'>,
): Promise<DailyAccountSnapshotFuturesResponse[]>;
export async function dailyAccountSnapshot(
  client: BinanceSignedClient,
  payload: DailyAccountSnapshotPayload<spot.DailyAccountSnapshotType>,
): Promise<
  DailyAccountSnapshotSpotResponse[] | DailyAccountSnapshotMarginResponse[] | DailyAccountSnapshotFuturesResponse[]
>;
export async function dailyAccountSnapshot(
  client: BinanceSignedClient,
  payload: DailyAccountSnapshotPayload<spot.DailyAccountSnapshotType>,
): Promise<
  DailyAccountSnapshotSpotResponse[] | DailyAccountSnapshotMarginResponse[] | DailyAccountSnapshotFuturesResponse[]
> {
  const payloadRaw = parse<DailyAccountSnapshotPayload<spot.DailyAccountSnapshotType>, DailyAccountSnapshotPayloadRaw>(
    payload,
    ({ startTime, endTime, ...other }) => ({
      startTime: parse(startTime, numberParser),
      endTime: parse(endTime, numberParser),
      ...other,
    }),
  );

  const response = await apiCall<
    DailyAccountSnapshotSpotResponseRaw | DailyAccountSnapshotMarginResponseRaw | DailyAccountSnapshotFuturesResponseRaw
  >({
    host: 'spot',
    path: '/sapi/v1/accountSnapshot',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payloadRaw,
  });

  if (response.code !== 200) throw new BinanceError(response.msg, response.code);

  if (payload.type === 'SPOT') {
    return parse<DailyAccountSnapshotSpotResponseRaw, DailyAccountSnapshotSpotResponse[]>(
      response as DailyAccountSnapshotSpotResponseRaw,
      ({ snapshotVos }) =>
        parseArray(snapshotVos, ({ updateTime, type, data, ...other }) => ({
          updateTime: parse(updateTime, dateParser),
          type: 'SPOT',
          data: parse(data, ({ totalAssetOfBtc, balances, ...other }) => ({
            totalAssetOfBtc: parse(totalAssetOfBtc, numberParser),
            balances: parseArray(balances, ({ free, locked, ...other }) => ({
              free: parse(free, numberParser),
              locked: parse(locked, numberParser),
              ...other,
            })),
            ...other,
          })),
          ...other,
        })),
    );
  }

  if (payload.type === 'MARGIN') {
    return parse<DailyAccountSnapshotMarginResponseRaw, DailyAccountSnapshotMarginResponse[]>(
      response as DailyAccountSnapshotMarginResponseRaw,
      ({ snapshotVos }) =>
        parseArray(snapshotVos, ({ updateTime, type, data, ...other }) => ({
          updateTime: parse(updateTime, dateParser),
          type: 'MARGIN',
          data: parse(
            data,
            ({ marginLevel, totalAssetOfBtc, totalLiabilityOfBtc, totalNetAssetOfBtc, userAssets, ...other }) => ({
              marginLevel: parse(marginLevel, numberParser),
              totalAssetOfBtc: parse(totalAssetOfBtc, numberParser),
              totalLiabilityOfBtc: parse(totalLiabilityOfBtc, numberParser),
              totalNetAssetOfBtc: parse(totalNetAssetOfBtc, numberParser),
              userAssets: parseArray(userAssets, ({ borrowed, free, interest, locked, netAsset, ...other }) => ({
                borrowed: parse(borrowed, numberParser),
                free: parse(free, numberParser),
                interest: parse(interest, numberParser),
                locked: parse(locked, numberParser),
                netAsset: parse(netAsset, numberParser),
                ...other,
              })),
              ...other,
            }),
          ),
          ...other,
        })),
    );
  }

  if (payload.type === 'FUTURES') {
    return parse<DailyAccountSnapshotFuturesResponseRaw, DailyAccountSnapshotFuturesResponse[]>(
      response as DailyAccountSnapshotFuturesResponseRaw,
      ({ snapshotVos }) =>
        parseArray(snapshotVos, ({ updateTime, type, data, ...other }) => ({
          updateTime: parse(updateTime, dateParser),
          type: 'FUTURES',
          data: parse(data, ({ assets, position, ...other }) => ({
            assets: parseArray(assets, ({ marginBalance, walletBalance, ...other }) => ({
              marginBalance: parse(marginBalance, numberParser),
              walletBalance: parse(walletBalance, numberParser),
              ...other,
            })),
            position: parseArray(position, ({ entryPrice, markPrice, positionAmt, unRealizedProfit, ...other }) => ({
              entryPrice: parse(entryPrice, numberParser),
              markPrice: parse(markPrice, numberParser),
              positionAmt: parse(positionAmt, numberParser),
              unRealizedProfit: parse(unRealizedProfit, numberParser),
              ...other,
            })),
            ...other,
          })),
          ...other,
        })),
    );
  }

  return null;
}
