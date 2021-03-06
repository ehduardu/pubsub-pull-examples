/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
 const projectId = 'projectId';
 const subscriptionName = 'balance-notification-sub';
 const maxInProgress = 5;
 const timeout = 5;
 
 // Imports the Google Cloud client library
 const {PubSub, v1} = require('@google-cloud/pubsub');
 
 // Creates a client; cache this for further use
 const pubSubClient = new PubSub();
 const syncClient = new v1.SubscriberClient();
 
 function listenForMessages() {
   const subscriberOptions = {
     flowControl: {
       maxMessages: maxInProgress,
       allowExcessMessages: false
     },
   };
 
   // References an existing subscription
   const subscription = pubSubClient.subscription(subscriptionName, subscriberOptions);
 
   // Create an event handler to handle messages
   let messageCount = 0;
   let ackIds = [];
   const messageHandler = message => {
     console.log(`Received message ${message.id}:`);
     console.log(`\tData: ${message.data}`);
     console.log(`\tAttributes: ${message.attributes}`);
     messageCount += 1;
 
     // "Ack" (acknowledge receipt of) the message
     // message.ack();
     ackIds.push(message.ackId);
   };
 
   // Create an event handler to handle errors
   const errorHandler = function (error) {
     // Do something with the error
     console.error(`ERROR: ${error}`);
     throw error;
   };
 
   // Listen for new messages until timeout is hit
   subscription.on('message', messageHandler);
   subscription.on('error', errorHandler);
 
   setTimeout(async () => {
    if (ackIds.length > 0) {
      const formattedSubscription = syncClient.subscriptionPath(
        projectId,
        subscriptionName
      );

      // Acknowledge all of the messages. You could also acknowledge
      // these individually, but this is more efficient.
      const ackRequest = {
        subscription: formattedSubscription,
        ackIds,
      };
  
      await syncClient.acknowledge(ackRequest);
    }

     subscription.removeListener('message', messageHandler);
     subscription.removeListener('error', errorHandler);
     console.log(`${messageCount} message(s) received.`);
 
     
   }, timeout * 1000);
 }
 
 listenForMessages();