import { BinanceKeyClient } from '../../../clients';
import { apiCall } from '../../../apiCall';
import { UserDataResponseRaw, UserDataResponse, parseUserData } from './parsers';

export function listenSpot(client: BinanceKeyClient, callback: (data: UserDataResponse, error?: any) => any) {
  const parseCallback =
    callback &&
    ((data: UserDataResponseRaw, error?: any) => {
      if (error) return callback(void 0, error);

      const response = parseUserData(data);
      callback(response);
    });

  return apiCall<UserDataResponseRaw>(
    {
      host: 'spot',
      path: '/api/v3/userDataStream',
      securityType: 'USER_DATA_STREAM',

      client,
    },
    parseCallback,
  );
}
