/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const subscriptionName = 'balance-notification-sub';
const maxInProgress = -1;
const timeout = 10;

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForMessages() {
  const subscriberOptions = {
    flowControl: {
      maxMessages: maxInProgress,
      allowExcessMessages: true,
    },
    batching: {
      maxMessages: maxInProgress,
    }
  };

  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName, subscriberOptions);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
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
    subscription.removeListener('message', messageHandler);
    subscription.removeListener('error', errorHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

listenForMessages();