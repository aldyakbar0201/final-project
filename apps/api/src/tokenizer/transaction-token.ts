// /*Install midtrans-client (https://github.com/Midtrans/midtrans-nodejs-client) NPM package.
// npm install --save midtrans-client*/

// //SAMPLE REQUEST START HERE

// import midtransClient from 'midtrans-client';

// const {id, productName, price, quantity } = await request.json()

// // Create Snap API instance
// let snap = new midtransClient.Snap({
//         // Set to true if you want Production Environment (accept real transaction).
//         isProduction : false,
//         serverKey : 'MIDTRANS_SERVER_KEY',
//         clientKey : 'MIDTRANS_CLIENT_KEY'
//     });

// let parameter = {
//     "item_details": {
//         "name": productName,
//         "price": price,
//         "quantity": quantity
//     },
//     "transaction_details": {
//         "order_id": id,
//         "gross_amount": price * quantity
//     }

// };

// snap.createTransaction(parameter)
//     .then((transaction)=>{
//         // transaction token
//         let transactionToken = transaction.token;
//         console.log('transactionToken:',transactionToken);
//     })
