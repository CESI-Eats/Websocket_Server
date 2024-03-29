import { sockets } from './server';
import { MessageLapinou, sendMessage, connectLapinou, handleTopic, initExchange, initQueue } from './services/lapinouService';

export function initLapinou(){
    connectLapinou().then(async () => {
      initExchange('notifications').then((exchange) => {
        initQueue(exchange, 'send.websocket').then(({queue, topic}) => {
          handleTopic(queue, topic, async (msg) => {
            const message = msg.content as MessageLapinou;
            try{
              console.log(` [x] Received message: ${JSON.stringify(message)}`);
              if (message.content.ids[0] === 'all'){
                message.content.ids = Array.from(sockets.keys());
              }
              sendNotification(message.content.topic, message.content.message, message.content.ids);
            }
            catch(err){
              console.log(err);
            }
          });
        });
      });
    }).catch((error) => console.log('Failed to connect to MongoDB.', error));

}

function sendNotification(topic: string, message: any, clientIds: string[]) {
  for (let id of clientIds) {
      const client = sockets.get(id);
      if (client) {
          client.emit(topic, message);
      } else {
          console.error(`Client ${id} not found`);
      }
  }
}
