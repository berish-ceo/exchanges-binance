import { BinanceClient, BinanceClientOptions } from './binanceClient';

export interface BinanceKeyClientOptions extends BinanceClientOptions {
  apiKey: string;

  userDataStreamPingInterval?: number;
  userDataStreamRecreateTimeout?: number;
}

export class BinanceKeyClient extends BinanceClient {
  protected _options: BinanceKeyClientOptions = null;

  constructor(options: BinanceKeyClientOptions) {
    super(options);

    if (!options) throw new TypeError('BinanceKeyClient constructor options is empty');
    if (typeof options !== 'object') throw new TypeError('BinanceKeyClient constructor options is not object');

    if (!options.apiKey) throw new TypeError('BinanceKeyClient constructor options.apiKey is empty');

    this._options = options;
    this._options.userDataStreamPingInterval = this._options.userDataStreamPingInterval || 30 * 1e3;
    this._options.userDataStreamRecreateTimeout = this._options.userDataStreamRecreateTimeout || 5 * 1e3;
  }

  get options() {
    return this._options;
  }

  get apiKey() {
    return this.options.apiKey;
  }

  get userDataStreamPingInterval() {
    return this.options.userDataStreamPingInterval;
  }

  get userDataStreamRecreateTimeout() {
    return this.options.userDataStreamRecreateTimeout;
  }
}
