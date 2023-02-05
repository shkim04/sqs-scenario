require('dotenv').config('./.env');
const { Consumer } = require('sqs-consumer');

const AWS_SQS_MILEAGE_URL = process.env.AWS_SQS_MILEAGE_URL;

const mileageConsumerApp = Consumer.create({
  queueUrl: AWS_SQS_MILEAGE_URL,
  handleMessage: async (message) => {
    let messageBody = JSON.parse(message.Body);
    let mileageInfo = parseInt(messageBody.mileageAccumulated);
    let price = parseInt(messageBody.price);
    let newMileage = mileageInfo + (price * 0.02);
    console.log("newMileage:", newMileage);
  }
});

mileageConsumerApp.on('error', (err) => {
  console.error(err.message);
});

mileageConsumerApp.on('processing_error', (err) => {
  console.error(err.message);
});

mileageConsumerApp.start();