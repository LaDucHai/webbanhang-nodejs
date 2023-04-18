const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const { MyQuery } = require('./src/MyQuery/index');
const { MyJwt } = require('./src/MyJwt/index');

// const sqlConfig = {
//     user: 'sa',
//     password: '20111995Hai',
//     database: 'webbanhang',
//     server: '103.178.233.184',
//     synchronize: true,
//     trustServerCertificate: true,
//     pool: {
//         max: 10,
//         min: 0,
//         idleTimeoutMillis: 30000
//     },
//     options: {
//         encrypt: false, // for azure
//         trustServerCertificate: true // change to true for local dev / self-signed certs
//     }
// }
  
// init sql
// sql.connect(sqlConfig);
sql.connect('Server=103.178.233.184,1433;Database=webbanhang;User Id=sa;Password=20111995Hai;Trusted_Connection=True;TrustServerCertificate=True;');
const myQuery = new MyQuery(sql);
const loginJwt = new MyJwt('login');
// async () => {
//     try {
//         // make sure that any items are correctly URL encoded in the connection string
//         await sql.connect(sqlConfig)
//         const value = 'useridladuchai1';
//         const result = await sql.query `select * from dbo.UserInfor where UserId = ${value}`;
//         console.dir(result)
//     } catch (err) {
//         console.error(err);
//     }
// }


router.get('/', (req, res) => {
    res.send('Successful response.');
});

router.post('/signup', async (req, res) => {
    try {
        let signupInfor = req.body;
        signupInfor.UserId = uuidv4();
        await myQuery.signup(signupInfor);
        res.send({
            signupState: true,
            data: {}
        });
    } catch (error) {
        res.send({
            signupState: false,
            err: { error }
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        let loginInfor = req.body;
        let infor = await myQuery.login(loginInfor);
        let jsonData = infor.recordset[0];

        // create token:
        let tokenLogin = loginJwt.sign(jsonData);

        res.send({
            loginState: true,
            token: { tokenLogin }
        });
    } catch (error) {
        res.send({
            loginState: false,
            err: {error}
        });
    }
});

module.exports = router;