require('dotenv').config('./.env');
const express = require('express');
const aws = require('aws-sdk');

const sqsClient = new aws.SQS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  // always recommended to save credentials in .env file
});

const app = express();
const PORT = 3000;
const AWS_SQS_MILEAGE_URL = process.env.AWS_SQS_MILEAGE_URL;
const AWS_SQS_PRODUCT_TRACKING_URL = process.env.AWS_SQS_PRODUCT_TRACKING_URL;

app.use(express.json());

app.get('/purchase', async (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const price = req.body.price;
  const mileageAccumulated = req.body.mileageAccumulated;
  const trackingId = req.body.trackingId;
 
  const mileagePayload = {
    'MessageBody': JSON.stringify({
      id: id,
      username: username,
      mileageAccumulated: mileageAccumulated,
      price: price
    }),
    'QueueUrl': AWS_SQS_MILEAGE_URL
  };

  const trackingPayload = {
    'MessageBody': JSON.stringify({
      id: id,
      username: username,
      trackingId: trackingId
    }),
    'QueueUrl': AWS_SQS_PRODUCT_TRACKING_URL
  };

  try {
    const mileageResponse = await sqsClient.sendMessage(mileagePayload).promise();
    const trackingReponse = await sqsClient.sendMessage(trackingPayload).promise();
    console.log(mileageResponse, trackingReponse);
    res.status(200).send('Order Request Success');
  }
  catch(err) {
    console.log('get /purchase error', err);
    res.status(500).send('Order Request Fail From Server');
  }  
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});