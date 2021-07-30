import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface GetDetailOnSubAccountMarginAccountResponse {
  email: string;
  marginLevel: number;
  totalAssetOfBtc: number;
  totalLiabilityOfBtc: number;
  totalNetAssetOfBtc: number;
  marginTradeCoeffVo: {
    forceLiquidationBar: number;
    marginCallBar: number;
    normalBar: number;
    canTrade: boolean;
  };
  marginUserAssetVoList: {
    asset: string;
    borrowed: number;
    free: number;
    interest: number;
    locked: number;
    netAsset: number;
  }[];
}

interface GetDetailOnSubAccountMarginAccountResponseRaw {
  email: string;
  marginLevel: string;
  totalAssetOfBtc: string;
  totalLiabilityOfBtc: string;
  totalNetAssetOfBtc: string;
  marginTradeCoeffVo: {
    forceLiquidationBar: string;
    marginCallBar: string;
    normalBar: string;
    canTrade: boolean;
  };
  marginUserAssetVoList: {
    asset: string;
    borrowed: string;
    free: string;
    interest: string;
    locked: string;
    netAsset: string;
  }[];
}

export async function getDetailOnSubAccountMarginAccount(client: BinanceSignedClient, email: string) {
  const response = await apiCall<GetDetailOnSubAccountMarginAccountResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/margin/account',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: { email },
  });

  return parse<GetDetailOnSubAccountMarginAccountResponseRaw, GetDetailOnSubAccountMarginAccountResponse>(
    response,
    ({
      marginLevel,
      totalAssetOfBtc,
      totalLiabilityOfBtc,
      totalNetAssetOfBtc,
      marginTradeCoeffVo,
      marginUserAssetVoList,
      ...other
    }) => ({
      marginLevel: parse(marginLevel, numberParser),
      totalAssetOfBtc: parse(totalAssetOfBtc, numberParser),
      totalLiabilityOfBtc: parse(totalLiabilityOfBtc, numberParser),
      totalNetAssetOfBtc: parse(totalNetAssetOfBtc, numberParser),
      marginTradeCoeffVo: parse(marginTradeCoeffVo, ({ forceLiquidationBar, marginCallBar, normalBar, ...other }) => ({
        forceLiquidationBar: parse(forceLiquidationBar, numberParser),
        marginCallBar: parse(marginCallBar, numberParser),
        normalBar: parse(normalBar, numberParser),
        ...other,
      })),
      marginUserAssetVoList: parseArray(
        marginUserAssetVoList,
        ({ borrowed, free, interest, locked, netAsset, ...other }) => ({
          borrowed: parse(borrowed, numberParser),
          free: parse(free, numberParser),
          interest: parse(interest, numberParser),
          locked: parse(locked, numberParser),
          netAsset: parse(netAsset, numberParser),
          ...other,
        }),
      ),
      ...other,
    }),
  );
}
