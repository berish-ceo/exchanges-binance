import Html5WebSocket from 'html5-websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';

export interface SocketCallOptions {
  host: string;
  path: string;
}

export function socketCall<Response = any>(options: SocketCallOptions, callback: (data: Response, error?: any) => any) {
  if (!options) throw new TypeError('socketCall options is empty');
  if (typeof options !== 'object') throw new TypeError('socketCall options is not object');

  if (!callback) throw new TypeError('socketCall callback is empty');
  if (typeof callback !== 'function') throw new TypeError('socketCall callback is not function');

  if (!options.host) throw new TypeError('socketCall options.host is empty');
  if (!options.path) throw new TypeError('socketCall options.path is empty');

  const queryPath = [options.host, options.path].filter(Boolean).join('/');

  const socket = new ReconnectingWebSocket(queryPath, undefined, {
    connectionTimeout: 4 * 1e3,
    WebSocket: typeof window !== 'undefined' ? WebSocket : Html5WebSocket,
    debug: false,
    maxReconnectionDelay: 10 * 1e3,
    minReconnectionDelay: 4 * 1e3,
    maxRetries: Infinity,
  });

  socket.onmessage = (e) => {
    const data = e && e.data;
    if (!data) return callback(void 0, void 0);

    try {
      const msg = JSON.parse(data);
      return callback(msg, void 0);
    } catch (err) {
      return callback(void 0, err);
    }
  };
  return () => socket.close(1000, 'Close handle was called');
}
