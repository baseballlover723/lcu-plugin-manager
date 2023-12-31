import WebSocket from 'ws';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const MESSAGE_TYPES = {
  WELCOME: 0,
  PREFIX: 1,
  CALL: 2,
  CALLRESULT: 3,
  CALLERROR: 4,
  SUBSCRIBE: 5,
  UNSUBSCRIBE: 6,
  PUBLISH: 7,
  EVENT: 8,
};

export default class RiotWebSocket extends WebSocket {
  constructor(clientData) {
    super(`wss://riot:${clientData.password}@127.0.0.1:${clientData.port}/`, 'wamp');

    this.session = null;
    this.on('message', this._onMessage.bind(this));
  }

  close() {
    super.close();
    this.session = null;
  }

  terminate() {
    super.terminate();
    this.session = null;
  }

  subscribe(topic, callback) {
    super.addListener(topic, callback);
    this.send(MESSAGE_TYPES.SUBSCRIBE, topic);
  }

  unsubscribe(topic, callback) {
    super.removeListener(topic, callback);
    if (this.listeners(topic).length === 0) {
      this.send(MESSAGE_TYPES.UNSUBSCRIBE, topic);
    }
  }

  send(type, message) {
    super.send(JSON.stringify([type, message]));
  }

  _onMessage(message) {
    const [type, ...data] = JSON.parse(message);

    switch (type) {
      case MESSAGE_TYPES.WELCOME:
        this.session = data[0];
        // this.protocolVersion = data[1];
        // this.details = data[2];
        break;
      case MESSAGE_TYPES.CALLRESULT:
        console.log('Unknown call, if you see this file an issue at https://discord.gg/hPtrMcx with the following data:', data);
        break;
      case MESSAGE_TYPES.TYPE_ID_CALLERROR:
        console.log('Unknown call error, if you see this file an issue at https://discord.gg/hPtrMcx with the following data:', data);
        break;
      case MESSAGE_TYPES.EVENT:
        const [topic, payload] = data;
        this.emit(topic, payload);
        break;
      default:
        console.log('Unknown type, if you see this file an issue with at https://discord.gg/hPtrMcx with the following data:', [type, data]);
        break;
    }
  }
}
