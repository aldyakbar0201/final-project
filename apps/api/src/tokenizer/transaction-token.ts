/*Install midtrans-client (https://github.com/Midtrans/midtrans-nodejs-client) NPM package.
npm install --save midtrans-client*/

//SAMPLE REQUEST START HERE

import { MidtransClient } from 'midtrans-node-client';

const req = {
  body: {
    id: 'order-id',
    productName: 'Sample Product',
    price: 10000,
    quantity: 1,
  },
};

const { productName, price, quantity } = req.body;

// Create Snap API instance
const snap = new MidtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: 'MIDTRANS_SERVER_KEY',
  // clientKey: 'MIDTRANS_CLIENT_KEY',
});

const id = new Date().getTime().toString();
const parameter = {
  item_details: {
    name: productName,
    price: price,
    quantity: quantity,
  },
  transaction_details: {
    order_id: id,
    gross_amount: price * quantity,
  },
};

snap.createTransaction(parameter).then((transaction) => {
  // transaction token
  const transactionToken = transaction.token;
  console.log('transactionToken:', transactionToken);
});
