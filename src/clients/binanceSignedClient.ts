import { usdtFutures, spotMarginSavingsMaining } from '../api';
import { BinanceKeyClient, BinanceKeyClientOptions } from './binanceKeyClient';

export interface BinanceSignedClientOptions extends BinanceKeyClientOptions {
  apiSecret: string;
}

export class BinanceSignedClient extends BinanceKeyClient {
  protected _options: BinanceSignedClientOptions = null;

  constructor(options: BinanceSignedClientOptions) {
    super(options);

    if (!options) throw new TypeError('BinanceSignedClientOptions constructor options is empty');
    if (typeof options !== 'object') throw new TypeError('BinanceSignedClientOptions constructor options is not object');

    if (!options.apiSecret) throw new TypeError('BinanceSignedClientOptions constructor options.apiSecret is empty');

    this._options = options;
  }

  get options() {
    return this._options;
  }

  get apiSecret() {
    return this.options.apiSecret;
  }

  checkFuturesAPIConnection = async (): Promise<boolean> => {
    try {
      await usdtFutures.accountTrades.accountInformationV2(this);
      return true;
    } catch (err) {
      return false;
    }
  };

  checkSpotAPIConnection = async () => {
    try {
      await spotMarginSavingsMaining.spotAccountTrade.accountInformation(this);
      return true;
    } catch (err) {
      return false;
    }
  };
}
