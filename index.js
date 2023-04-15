const sql = require('mssql');
const express = require('express');
const router = require('./router');
const app = express();

const sqlConfig = {
    user: 'sa',
    password: '20111995Hai',
    database: 'UserInfor',
    server: '103.178.233.184',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
    }
}

async () => {
    try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig)
        const value = 'useridladuchai1';
        const result = await sql.query `select * from dbo.UserInfor where UserId = ${value}`;
        console.dir(result)
    } catch (err) {
        console.error(err);
    }
}

app.use(express.json());
app.use(express.static('.'));
app.use('/', router);
  
app.listen(3000, () => console.log('Example app is listening on port 3000.'));