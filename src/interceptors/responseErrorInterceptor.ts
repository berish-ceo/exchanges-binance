import type { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { BinanceClient, BinanceError } from '..';

export function responseErrorInterceptor(binanceClient: BinanceClient): (instance: AxiosInstance) => () => void {
  return (instance) => {
    const id = instance.interceptors.response.use(
      (response) => {
        if (!response) throw BinanceError.UnknownError();

        response.data = response.data || {};

        if (response.status !== 200 || ('success' in response.data && !response.data['success']))
          throw BinanceError.getBinanceErrorFromData(
            response.data,
            response.config.url,
            Object.entries(response.headers),
          );

        return response;
      },
      (error: AxiosError | Error | any) => {
        if (error instanceof BinanceError) throw error;

        if (error) {
          if (error instanceof BinanceError) throw error;

          if (error.response) {
            const response: AxiosResponse = error.response;

            throw BinanceError.getBinanceErrorFromData(
              response.data,
              response.config.url,
              Object.entries(response.headers),
            );
          } else if (error.config) {
            const config: AxiosRequestConfig = error.config;

            throw BinanceError.getBinanceErrorFromData(null, config.url);
          } else {
            throw BinanceError.UnknownError();
          }
        }
        throw BinanceError.UnknownError();
      },
    );

    return () => {
      instance.interceptors.response.eject(id);
    };
  };
}
