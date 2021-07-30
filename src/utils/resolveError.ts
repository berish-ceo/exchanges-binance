import { BinanceError } from '../info';

export function resolveError(data: { [key: string]: any } | string, status: number, statusText: string) {
  try {
    const json = typeof data === 'string' ? JSON.parse(data) : data;
    return new BinanceError(json.msg || `${status || ''} ${statusText || ''}`, json.code);
  } catch (e) {
    return new BinanceError(`${status || ''} ${statusText || ''} ${JSON.stringify(data)}`, void 0);
  }
}
