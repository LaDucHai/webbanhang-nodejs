const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { createClient } = require('redis'); 

const { MyQuery } = require('./src/MyQuery/index');
const { MyJwt } = require('./src/MyJwt/index');
const { TOKENENCODESTRING, TOKENKEY } = require('./src/Constant/index');
const { JwtVerify } = require('./src/Middle/JwtVerify/index');
const { handleData } = require('./src/Middle/common/index');


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


router.get('/', (req, res) => {

    res.send('Successful response.');
});


router.get('/addressList', (req, res) => {
    const type = req.query.type;
    const condition = req.query.condition;
    switch(type) {
        case 'Province':
            myQuery.getProvince((err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'District':
            myQuery.getDistrict(condition, (err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'Commune':
            myQuery.getCommune(condition, (err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'Hamlet':
            myQuery.getHamlet(condition, (err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'Home_Number':
            myQuery.getHome_Number(condition, (err, data) => {
                handleData(res, err, data);
            })
            break;

        default:
            return res.send({
                state: false,
                err: {message: 'Invalid parameter (addressList)'}
            });
      }
});

router.post('/signup', (req, res) => {
    try {
        let signupInfor = req.body;
        signupInfor.User_Id = uuidv4();
        myQuery.signup(signupInfor, (err, data) => {
            handleData(res, err, data);
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
            handleData(res, err, decoded);
        });
    } catch (err) {
        res.send({
            state: false,
            err: err
        });
    }
});

router.get('/userName', (req, res) => {
    try {
        let userId = req.query.userId;
        myQuery.getUserName(userId, (err, data) => {
            handleData(res, err, data);
        });
    } catch (error) {
        res.send({
            state: false,
            err: err
        });
    }
})

router.get('/company:id', (req, res) => {
    const id = req.params.id;
    try {
        if (id === 'myCompany') {
            loginJwt.verify(req.headers.authorization, (err, decoded) => {
                if (err) {
                    return res.send({
                        state: false,
                        err: err 
                    });
                } else {
                    myQuery.getMyCompany(decoded.User_Id, (err, data)=> {
                        handleData(res, err, data);
                    })
                }
            })
        } else {
            myQuery.getCompanyDetail(id, (err, data) => {
                handleData(res, err, data);
            });
        }
    } catch (error) {
        return res.send({
            state: false,
            err: error
        });
    }
});

router.post('/uploadtest', JwtVerify, (req, res) => {
    try {
        console.log('params', req.query.a)
        let path = `${uuidv4()}-${req.query.a}.txt`;
        fs.writeFile(`${__dirname}/public/text/${path}`, 'laduchai',  function(err) {
            handleData(res, err, path);
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

// router.post('/company/signupCompany', JwtVerify, (req, res) => {
//     try {
//         let addCompanyOptions = req.body;
//         addCompanyOptions.Company_Id = uuidv4();
//         myQuery.addCompany(addCompanyOptions, (err, data) => {
//             handleData(res, err, data);
//         })
//     } catch (error) {
//         return res.send({
//             state: false,
//             err: error
//         });
//     }
// });

router.post('/company/signupCompany', JwtVerify, (req, res) => {
    try {
        let addCompanyOptions = req.body;
        addCompanyOptions.Company_Id = uuidv4();
        myQuery.addCompany(addCompanyOptions, (err, data) => {
            const data1 = data;
            data && (data1.Company_Id = addCompanyOptions.Company_Id);
            handleData(res, err, data1);
        })
    } catch (error) {
        return res.send({
            state: false,
            err: error
        });
    }
});

router.post('/address/addAdress', JwtVerify, (req, res) => {
    try {
        let addressOptions = req.body;
        addressOptions.Address_Id = uuidv4();
        myQuery.addAddress(addressOptions, (err, data) => {
            handleData(res, err, data);
        });
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
        // if (type === 'product') {
        //     let productOptions = req.body;
        //     productOptions.Product_Id = uuidv4();
        //     myQuery.addProduct(productOptions, (err, data) => {
        //         const data1 = data;
        //         data && (data1.Product_Id = productOptions.Product_Id);
        //         handleData(res, err, data1);
        //     })
        // }
        // if (type === 'productImage') {
        //     let productImageOptions = req.body;
        //     productImageOptions.ProductImage_Id = uuidv4();
        //     myQuery.addProductImage(productImageOptions, (err, data) => {
        //         handleData(res, err, data);
        //     })
        // }
        switch (type) {
            case 'product':
                let productOptions = req.body;
                productOptions.Product_Id = uuidv4();
                myQuery.addProduct(productOptions, (err, data) => {
                    const data1 = data;
                    data && (data1.Product_Id = productOptions.Product_Id);
                    handleData(res, err, data1);
                })
                break;
    
            case 'productImage':
                let productImageOptions = req.body;
                productImageOptions.ProductImage_Id = uuidv4();
                myQuery.addProductImage(productImageOptions, (err, data) => {
                    handleData(res, err, data);
                })
                break;
            
            case 'likeProduct':
                let productLikeOptions_like = req.body;
                productLikeOptions_like.ProductLike_Id = uuidv4();
                myQuery.likeProduct(productLikeOptions_like, (err, data) => {
                    handleData(res, err, data);
                })
                break;
            
            case 'disLikeProduct':
                let productLikeOptions_disLike = req.body;
                myQuery.disLikeProduct(productLikeOptions_disLike, (err, data) => {
                    handleData(res, err, data);
                })
                break;
        
            default:
                return res.send({
                    state: false,
                    err: {message: 'Invalid parameter'}
                });
        }
    } catch (error) {
        return res.send({
            state: false,
            err: error
        });
    }
});

router.get('/product', (req, res) => {
    const type = req.query.type;
    switch (type) {
        case 'product':
            const pageIndex = req.query.pageIndex;
            const pageSize = req.query.pageSize;
            myQuery.getProduct({PageIndex: pageIndex, PageSize: pageSize}, (err, data) => {
                handleData(res, err, data);
            })
            break;
        
        case 'productWithOptions':
            let productWithOptions = {
                PageIndex: req.query.pageIndex, 
                PageSize: req.query.pageSize,
                Product_Type: req.query.productType,
                Product_Industry: req.query.productIndustry,
                Product_Price1: req.query.productPrice1,
                Product_Price2: req.query.productPrice2,
                Product_Sale1: req.query.productSale1,
                Product_Sale2: req.query.productSale2
            }
            myQuery.getProductWithOptions(productWithOptions, (err, data) => {
                handleData(res, err, data);
            })
            break;
            
        case 'productWithSearch':
            let productWithSearch = {
                PageIndex: req.query.pageIndex, 
                PageSize: req.query.pageSize,
                Product_Name: req.query.productName,
            }
            myQuery.getProductWithSearch(productWithSearch, (err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'productImage':
            const product_Id = req.query.productId;
            let productImagePages = {};
            productImagePages.Product_Id = product_Id;
            myQuery.getProductImage(productImagePages, (err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'getProductLike':
            let userId = req.query.userId;
            let productId = req.query.productId;
            let productLikeOptions_getProductLike = {};
            productLikeOptions_getProductLike.User_Id = userId;
            productLikeOptions_getProductLike.Product_Id = productId;
            myQuery.getProductLike(productLikeOptions_getProductLike, (err, data) => {
                handleData(res, err, data);
            })
            break;
        
        case 'getProductDetail':
            let productId_getProductDetail = req.query.productId;
            myQuery.getProductDetail(productId_getProductDetail, (err, data) => {
                handleData(res, err, data)
            })
            break;
    
        default:
            return res.send({
                state: false,
                err: {message: 'Invalid parameter (product)'}
            });
    }
});

router.post('/cart', JwtVerify, (req, res) => {
    const type = req.query.type;
    switch(type) {
        case 'addCart':
            let cartOptions = req.body;
            cartOptions.Cart_Id = uuidv4();
            myQuery.addCart(cartOptions, (err, data) => {
                handleData(res, err, data);
            })
            break;

        default:
            return res.send({
                state: false,
                err: {message: 'Invalid parameter (cart)'}
            });
    }
})

router.get('/cart', JwtVerify, (req, res) => {
    const type = req.query.type;
    switch(type) {
        case 'getCart':
            let userId = req.query.userId;
            myQuery.getCart(userId, (err, data) => {
                handleData(res, err, data);
            })
            break;

        default:
            return res.send({
                state: false,
                err: {message: 'Invalid parameter (cart)'}
            });
    }
});

router.get('/chat', JwtVerify, (req, res) => {
    const type = req.query.type;
    switch(type) {
        case 'getChatRoom':
            let chatRoomsOptions_getChatRoom = {
                ChatRooms_User1_Id: req.query.userId1,
                ChatRooms_User2_Id: req.query.userId2
            }
            myQuery.getChatRoom(chatRoomsOptions_getChatRoom, (err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'getChatRooms':
            let userId = req.query.userId;
            myQuery.getChatRooms(userId, (err, data) => {
                handleData(res, err, data);
            })
            break;
        
        case 'addChatRoom':
            let chatRoomsOptions_addChatRoom = {
                ChatRomms_Id: uuidv4(),
                ChatRooms_User1_Id: req.query.userId1,
                ChatRooms_User2_Id: req.query.userId2
            }
            myQuery.addChatRoom(chatRoomsOptions_addChatRoom, (err, data) => {
                const data_1 = data;
                data && (data_1.ChatRomms_Id = chatRoomsOptions_addChatRoom.ChatRomms_Id)
                handleData(res, err, data_1);
            })
            break;
        
        case 'getMessage':
            let roomId = req.query.roomId;
            myQuery.getMessage(roomId, (err, data) => {
                handleData(res, err, data);
            })
            break;
        
        case 'getMessagePages':
            let messagePages = {
                PageIndex: req.query.pageIndex,
                PageSize: req.query.pageSize,
                ChatRomms_Id: req.query.chatRomms_Id
            };
            myQuery.getMessagePages(messagePages, (err, data) => {
                handleData(res, err, data);
            })
            break;
            
        case 'getMessages_notSeen':
            let messages_notSeenOptions = {
                Messages_User_Id: req.query.messagesUserId,
                ChatRoom_Id: req.query.chatRoomId
            }
            myQuery.getMessages_notSeen(messages_notSeenOptions, (err, data) => {
                handleData(res, err, data);
            })
            break;

        case 'updateMessageState':
            let updateMessageStateOptions = {
                User_Id: req.query.userId,
                ChatRoom_Id: req.query.chatRoomId
            }
            myQuery.updateMessageState(updateMessageStateOptions, (err, data) => {
                handleData(res, err, data);
            })
            break;

        default:
            return res.send({
                state: false,
                err: {message: 'Invalid parameter (chat)'}
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