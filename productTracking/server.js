require('dotenv').config('./.env');
const { Consumer } = require('sqs-consumer');

const AWS_SQS_PRODUCT_TRACKING_URL = process.env.AWS_SQS_PRODUCT_TRACKING_URL;

const productTrackingConsumerApp = Consumer.create({
  queueUrl: AWS_SQS_PRODUCT_TRACKING_URL,
  handleMessage: async (message) => {
    let messageBody = JSON.parse(message.Body);
    let productTrackingId = messageBody.trackingId;
    // tracking logic here
    console.log("productTrackingId:", productTrackingId);
  }
});

productTrackingConsumerApp.on('error', (err) => {
  console.error(err.message);
});

productTrackingConsumerApp.on('processing_error', (err) => {
  console.error(err.message);
});

productTrackingConsumerApp.start();