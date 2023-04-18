const express = require('express');
const router = require('./router');
const cors = require('cors');
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
    // 👇️ specify CORS headers to send 👇️
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

app.use(express.json());
app.use(express.static('public'));
app.use('/', router);


app.listen(3000, () => console.log('Example app is listening on port 3000.'));