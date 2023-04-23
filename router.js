const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const { MyQuery } = require('./src/MyQuery/index');
const { MyJwt } = require('./src/MyJwt/index');
const { TOKENENCODESTRING, TOKENKEY } = require('./src/Constant/index');
const { JwtVerify } = require('./src/Middle/JwtVerify/index');


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
sql.on('error', err => {
    console.error('sql on err:', err);
})
const myQuery = new MyQuery(sql);
const loginJwt = new MyJwt(TOKENKEY, TOKENENCODESTRING);
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


router.post('/signup', (req, res) => {
    try {
        let signupInfor = req.body;
        signupInfor.User_Id = uuidv4();
        myQuery.signup(signupInfor, (err, data) => {
            if (err) {
                return res.send({
                    signupState: false,
                    err: err
                });
            } else {
                return res.send({
                    signupState: true,
                    data: data
                });
            }
        });
    } catch (error) {
        return res.send({
            signupState: false,
            err: { error }
        });
    }
});

router.post('/login', (req, res) => {
    try {
        let loginInfor = req.body;
        myQuery.login(loginInfor, (infor) => {
            let jsonData = infor.recordset[0];

            // create token:
            let tokenLogin = loginJwt.sign(jsonData);

            res.send({
                loginState: true,
                token: { tokenLogin }
            });
        });   
    } catch (error) {
        console.error(error);
        res.send({
            loginState: false,
            err: {error}
        });
    }
});

router.get('/getUserInfor', JwtVerify, (req, res) => {
    try {
        loginJwt.verify(req.headers.authorization, (err, decoded) => {
            if (err) {
                res.send({
                    state: false,
                    err: err
                });
            } else {
                res.send({
                    state: true,
                    data: decoded
                });
            }
        });
    } catch (err) {
        res.send({
            state: false,
            err: err
        });
    }
    
});

router.get('/company:id', JwtVerify, (req, res) => {
    try {
        if (req.params.id === 'myCompany') {
            loginJwt.verify(req.headers.authorization, (err, decoded) => {
                if (err) {
                    return res.send({
                        state: false,
                        err: err 
                    });
                } else {
                    myQuery.getMyCompany(decoded.User_Id, (err, data)=> {
                        if (err) {
                            return res.send({
                                state: false,
                                err: err 
                            });
                        }
                        return res.send({
                            state: true,
                            data: data
                        });
                    })
                }
            })
        } 
    } catch (err) {
        return res.send({
            state: false,
            err: err
        });
    }
});

router.post('/uploadtest', JwtVerify, (req, res) => {
    try {
        console.log('params', req.query.a)
        let path = `${uuidv4()}-${req.query.a}.txt`;
        fs.writeFile(`${__dirname}/public/text/${path}`, 'laduchai',  function(err) {
            if (err) {
                return res.send({
                    state: false,
                    err: err
                });
            }
            return res.send({
                state: true,
                data: path
            });
        })
    } catch (error) {
        return res.send({
            state: false,
            err: error
        });
    }
})

router.post('/upload/photo', JwtVerify, (req, res) => {
    // '/upload/photo?object=object'
    const object = req.query.object;
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" });
    }
    const time = new Date();
    // accessing the file
    const myFile = req.files.file; 
    let path = `${uuidv4()}-${time.toDateString()}-${myFile.name}`;
    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/photo/${object}/${path}`, function (err) {
        if (err) {
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: path});
    });
});

router.post('/upload/text', JwtVerify, (req, res) => {
    // '/upload/text?object=object'
    const object = req.query.object;
    const userId = req.body.userId;
    const time = new Date();
    let path = `${uuidv4()}-${time.toDateString()}-${userId}.txt`;
    fs.writeFile(`${__dirname}/public/text/${object}/${path}`, req.body.data,  function(err) {
        if (err) {
            return res.send({
                state: false,
                err: err
            });
        }
        return res.send({
            state: true,
            data: path
        });
    })
});

router.post('/company/signupCompany', JwtVerify, (req, res) => {
    try {
        let addCompanyOptions = req.body;
        addCompanyOptions.Company_Id = uuidv4();
        myQuery.addCompany(addCompanyOptions, (err, data) => {
            if (err) {
                return res.send({
                    state: false,
                    err: err
                });
            } else {
                return res.send({
                    state: true,
                    data: data
                });
            }
        })
    } catch (error) {
        return res.send({
            state: false,
            err: error
        });
    }
});

router.post('/product', JwtVerify, (req, res) => {
    const type = req.query.type;
    try {
        if (type === 'product') {
            let productOptions = req.body;
            productOptions.Product_Id = uuidv4();
            myQuery.addProduct(productOptions, (err, data) => {
                if (err) {
                    return res.send({
                        state: false,
                        err: err
                    });
                } else {
                    const data1 = data;
                    data1.Product_Id = productOptions.Product_Id;
                    return res.send({
                        state: true,
                        data: data1
                    });
                }
            })
        }
        if (type === 'productImage') {
            let productImageOptions = req.body;
            productImageOptions.ProductImage_Id = uuidv4();
            myQuery.addProductImage(productImageOptions, (err, data) => {
                if (err) {
                    return res.send({
                        state: false,
                        err: err
                    });
                } else {
                    return res.send({
                        state: true,
                        data: data
                    });
                }
            })
        }
    } catch (error) {
        return res.send({
            state: false,
            err: error
        });
    }
});

router.post('/testfile', (req, res) => {
    try {
        console.log(req.body);
        fs.writeFile(`${__dirname}/public/text/text.txt`, req.body.data,  function(err) {
            if (err) {
                return console.error(err);
            }
            console.log('ghi file thanh cong');
         });
        res.send({
            state: true,
            data: req.body
        });
    } catch (error) {
        res.send({
            state: false,
            err: { error }
        });
    }
});

router.get('/testfile', (req, res) => {
    try {
        fs.readFile(`${__dirname}/public/text/text.txt`, function (err, data) {
            if (err) {
               return console.error(err);
            }
            console.log("Noi dung file: " + data.toString());
            res.send({
                state: true,
                data: data.toString()
            });
        });


    } catch (error) {
        res.send({
            state: false,
            err: { error }
        });
    }
});

module.exports = router;