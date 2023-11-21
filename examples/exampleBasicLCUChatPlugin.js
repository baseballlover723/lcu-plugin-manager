import LCUPlugin from 'lcu-plugin';

export default class ExampleBasicLCUChatPlugin extends LCUPlugin {
  constructor() {
    super();
  }

  onConnect(clientData) {
    this.subscribeEvent('OnJsonApiEvent_lol-chat_v1_conversations', this.handleChat);
  }

  handleChat(event) {
    console.log('examples basic chat plugin event: ', event);
  }
}
