export {};
// import { HttpClient } from './client';
// import { checkParams } from './helper';

// export class PrivateHttpClient {
//   private _httpClient: HttpClient = null;

//   constructor(httpClient: HttpClient) {
//     this._httpClient = httpClient;
//   }

//   private orderCall = (payload, url: string) => {
//     const newPayload =
//       ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(payload.type) || !payload.type
//         ? { timeInForce: 'GTC', ...payload }
//         : payload;

//     return (
//       checkParams('order', newPayload, ['symbol', 'side', 'quantity']) &&
//       this._httpClient.privateCall(url, { type: 'LIMIT', ...newPayload }, 'POST')
//     );
//   };

//   tradesHistory = payload => {
//     return (
//       checkParams('tradesHitory', payload, ['symbol']) &&
//       this._httpClient.apiKeyCall('/api/v1/historicalTrades', payload)
//     );
//   };

//   order = payload => this.orderCall(payload, '/api/v3/order');
//   orderTest = payload => this.orderCall(payload, '/api/v3/order/test');
//   getOrder = payload => this._httpClient.privateCall('/api/v3/order', payload);
//   cancelOrder = payload => this._httpClient.privateCall('/api/v3/order', payload, 'DELETE');
//   openOrders = payload => this._httpClient.privateCall('/api/v3/openOrders', payload);
//   allOrders = payload => this._httpClient.privateCall('/api/v3/allOrders', payload);

//   accountInfo = payload => this._httpClient.privateCall('/api/v3/account', payload);
//   myTrades = payload => this._httpClient.privateCall('/api/v3/myTrades', payload);

//   withdraw = payload => this._httpClient.privateCall('/wapi/v3/withdraw.html', payload, 'POST');
//   withdrawHistory = payload => this._httpClient.privateCall('/wapi/v3/withdrawHistory.html', payload);
//   depositHistory = payload => this._httpClient.privateCall('/wapi/v3/depositHistory.html', payload);
//   depositAddress = payload => this._httpClient.privateCall('/wapi/v3/depositAddress.html', payload);
//   tradeFee = payload => this._httpClient.privateCall('/wapi/v3/tradeFee.html', payload);
//   assetDetail = payload => this._httpClient.privateCall('/wapi/v3/assetDetail.html', payload);

//   getDataStream = () => this._httpClient.privateCall('/api/v1/userDataStream', null, 'POST', true);
//   keepDataStream = payload => this._httpClient.privateCall('/api/v1/userDataStream', payload, 'PUT', false, true);
//   closeDataStream = payload => this._httpClient.privateCall('/api/v1/userDataStream', payload, 'DELETE', false, true);

//   marginGetDataStream = () => this._httpClient.privateCall('/sapi/v1/userDataStream', null, 'POST', true);
//   marginKeepDataStream = payload =>
//     this._httpClient.privateCall('/sapi/v1/userDataStream', payload, 'PUT', false, true);
//   marginCloseDataStream = payload =>
//     this._httpClient.privateCall('/sapi/v1/userDataStream', payload, 'DELETE', false, true);
//   futuresGetDataStream = () => this._httpClient.privateCall('/fapi/v1/listenKey', null, 'POST', true);
//   futuresKeepDataStream = payload => this._httpClient.privateCall('/fapi/v1/listenKey', payload, 'PUT', false, true);
//   futuresCloseDataStream = payload =>
//     this._httpClient.privateCall('/fapi/v1/listenKey', payload, 'DELETE', false, true);

//   marginAllOrders = payload => this._httpClient.privateCall('/sapi/v1/margin/allOrders', payload);
//   marginOrder = payload => this.orderCall(payload, '/sapi/v1/margin/order');
//   marginCancelOrder = payload => this._httpClient.privateCall('/sapi/v1/margin/order', payload, 'DELETE');
//   marginOpenOrders = payload => this._httpClient.privateCall('/sapi/v1/margin/openOrders', payload);
//   marginAccountInfo = payload => this._httpClient.privateCall('/sapi/v1/margin/account', payload);
//   marginMyTrades = payload => this._httpClient.privateCall('/sapi/v1/margin/myTrades', payload);
// }
