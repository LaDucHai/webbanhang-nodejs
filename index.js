const express = require('express');
const router = require('./router');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const app = express();

// core
// const whitelist = ['http://localhost:3001'];
// app.options('*', cors());
// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
// app.use(cors(corsOptions));

app.use(function (req, res, next) {
    // specify CORS headers to send
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'POST, PUT, PATCH, GET, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization',
    );
    next();
});
app.use(fileupload());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);


// test
// const promise1 = new Promise((resolve, reject) => {
//   resolve(1);
//   // reject('loi');
// })

// const promise2 = new Promise((resolve, reject) => {
//   // resolve(2);
//   reject('loi 2');
// })

// // promise1
// // .then(data => console.log('promise1', 'data', data))
// // .catch(err =>console.log('promise1', 'err', err))

// // promise2
// // .then(data => console.log('promise2', 'data', data))
// // .catch(err =>console.log('promise2', 'err', err))

// Promise.all([promise1, promise2]).then((values) => {
//   console.log(values);
// }).catch(err => console.error(err))


app.listen(4000, () => console.log('Example app is listening on port 4000.'));