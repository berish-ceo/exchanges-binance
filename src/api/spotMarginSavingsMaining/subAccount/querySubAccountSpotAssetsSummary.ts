import { BinanceSignedClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { parseArray, parse, boolParser, regExpParser, stringParser, numberParser } from '@berish/safe-parsing';

export interface QuerySubAccountSpotAssetsSummaryPayload {
  email?: string;
  page?: number;
  size?: number;
}

export interface QuerySubAccountSpotAssetsSummaryResponse {
  totalCount: number;
  masterAccountTotalAsset: number;
  spotSubUserAssetBtcVoList: {
    email: string;
    totalAsset: number;
  }[];
}

interface QuerySubAccountSpotAssetsSummaryResponseRaw {
  totalCount: number;
  masterAccountTotalAsset: string;
  spotSubUserAssetBtcVoList: {
    email: string;
    totalAsset: string;
  }[];
}

export async function querySubAccountSpotAssetsSummary(
  client: BinanceSignedClient,
  payload?: QuerySubAccountSpotAssetsSummaryPayload,
) {
  const response = await apiCall<QuerySubAccountSpotAssetsSummaryResponseRaw>({
    host: 'spot',
    path: '/sapi/v1/sub-account/spotSummary',
    method: 'GET',
    securityType: 'USER_DATA',

    client,
    data: payload,
  });

  return parse<QuerySubAccountSpotAssetsSummaryResponseRaw, QuerySubAccountSpotAssetsSummaryResponse>(
    response,
    ({ masterAccountTotalAsset, spotSubUserAssetBtcVoList, ...other }) => ({
      masterAccountTotalAsset: parse(masterAccountTotalAsset, numberParser),
      spotSubUserAssetBtcVoList: parseArray(spotSubUserAssetBtcVoList, ({ totalAsset, ...other }) => ({
        totalAsset: parse(totalAsset, numberParser),
        ...other,
      })),
      ...other,
    }),
  );
}
