const {PubSub} = require('@google-cloud/pubsub');
const faker = require('faker');

const projectId = 'projectId';
const topic = 'balance-notification';


// Creates a client; cache this for further use.
const pubsub = new PubSub({projectId});
 
async function sendMessages() {
  for (let index = 0; index < 10; index++) {
    (async () => {
      const dataTest = {
        name: faker.name.findName(),
        age: faker.datatype.number({ min: 18, max: 50 })
      };
  
      const data = JSON.stringify(dataTest);
      const dataBuffer = Buffer.from(data);
  
      await pubsub.topic(topic, {
        maxMilliseconds: 5 * 1000,
        maxMessages: 5
      }).publishMessage({ data:dataBuffer });
    })();
  }

  console.log('Populate Done.');
}
 
sendMessages().catch(console.error);