/** 
*@typedef {
*User_Id: string,
*Account_Name: string,
*Password: string,
*Email: string,
*Phone: string,
*First_Name: string,
*Last_Name: string,
*Birthday: string,
*Sex: string
*} SignupOptions // as InformationOptions
*/

/** 
*@typedef {
*Account_Name: string,
*Password: string
*} LoginOptions
*/

/** 
*@typedef {
*Company_Id: string,
*Company_Name: string,
*Company_BackgroudImage_URL: string,
*Company_Avatar_URL: string,
*Company_Infor_URL: string,
*Company_Describe_URL: string,
*Company_Tax_Code: string,
*Company_Star: number,
*Company_User_Id: string
*} AddCompanyOptions
*/

/**
*@typedef {
*Product_Id: string,
*Product_Type: string,
*Product_Industry: string,
*Product_Name: string,
*Product_Title: string,
*Product_Hastag: string,
*Product_Infor_URL: string,
*Product_Describe_URL: string,
*Product_Price: float,
*Product_VAT: float,
*Product_Like: int,
*Product_Sale: float,
*Product_AmountOfSold: int,
*Product_Amount: int,
*Product_User_Id: string,
*Product_Company_Id: string
*} ProductOptions
*/

/**
*@typedef {
*ProductImage_Id: string,
*ProductImage_URL: string,
*ProductImage_Product_Id: string
*} ProductImageOptions
*/

/**
*@typedef {
*PageIndex: int,
*PageSize: int,
*Product_Name?: string,
*Product_Type?: string, 
*Product_Industry?: string, 
*Product_Price1?: float, 
*Product_Price2?: float,
*Product_Sale1?: float,
*Product_Sale2?: float
*} ProductPages
*/

/**
*@typedef {
*Product_Id: string
*} ProductImagePages
*/

/**
*@typedef {
*ProductLike_Id?: string,
*User_Id: string,
*Product_Id: string
*} ProductLikeOptions
*/

/**
*@typedef {
*Address_Id: string,
*Address_Province: string,
*Address_District: string,
*Address_Commune: string,
*Address_Hamlet: string,
*Address_Home_Number: string,
*Address_Company_User: bit, --0: USER, 1: Company
*Address_User_Id: string, 
*Address_Company_Id: string
*} AddressOptions
*/

/**
*@typedef {
*Cart_Id: string,
*Cart_Product_Id: string,
*Cart_User_Id: string,
*Cart_Type: string
*} CartOptions
*/

/**
*@typedef {
*ChatRomms_Id?: string,
*ChatRooms_User1_Id: string,
*ChatRooms_User2_Id: string
*} ChatRoomsOptions
*/

/**
*@typedef {
*Messages_Id: string,
*Messages_ChatRoom_Id: string,
*Messages_Message: string,
*Messages_User_Id: string,
*Messages_Type: string,  
*Messages_State: string,  
*} MessageOptions 
*/

/**
*@typedef {
*PageIndex: int,
*PageSize: int,
*ChatRoom_Id: string  
*} MessagePages
*/


class MyQuery {

    constructor(sql) {
        this._sql = sql;
    }

    // get address list
    getProvince(callback) {
        let err;
        let data;
        this._sql.query `SELECT * FROM dbo.Province`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }
    getDistrict(condition, callback) {
        let err;
        let data;
        this._sql.query `SELECT * FROM dbo.District WHERE District_Province = ${condition}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }
    getCommune(condition, callback) {
        let err;
        let data;
        this._sql.query `SELECT * FROM dbo.Commune WHERE Commune_District = ${condition}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }
    getHamlet(condition, callback) {
        let err;
        let data;
        this._sql.query `SELECT * FROM dbo.Hamlet WHERE Hamlet_Commune = ${condition}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }
    getHome_Number(condition, callback) {
        let err;
        let data;
        this._sql.query `SELECT * FROM dbo.Home_Number WHERE Home_Number_Hamlet = ${condition}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }
    //----------------

    signup(signupOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_signup 
        ${signupOptions.User_Id}, 
        ${signupOptions.Account_Name}, 
        ${signupOptions.Password}, 
        ${signupOptions.Phone}, 
        ${signupOptions.Email}, 
        ${signupOptions.First_Name}, 
        ${signupOptions.Last_Name}, 
        ${signupOptions.Birthday}, 
        ${signupOptions.Sex}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    login(loginOptions, callback) {
        this._sql.query `EXEC proc_login ${loginOptions.Account_Name}, ${loginOptions.Password}`
        .then(result => {
            callback(result);
        }).catch(err => {
            console.error(err);
        })
    }

    getMyCompany(myUserId, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getMyCompany ${myUserId}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getCompanyDetail(companyId, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getCompany_withId ${companyId}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addCompany(addCompanyOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addCompany 
        ${addCompanyOptions.Company_Id}, 
        ${addCompanyOptions.Company_Name}, 
        ${addCompanyOptions.Company_BackgroudImage_URL}, 
        ${addCompanyOptions.Company_Avatar_URL}, 
        ${addCompanyOptions.Company_Infor_URL}, 
        ${addCompanyOptions.Company_Describe_URL}, 
        ${addCompanyOptions.Company_Tax_Code}, 
        ${addCompanyOptions.Company_Star}, 
        ${addCompanyOptions.Company_User_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addAddress(addressOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addAddress 
        ${addressOptions.Address_Id},
        ${addressOptions.Address_Province},
        ${addressOptions.Address_District},
        ${addressOptions.Address_Commune},
        ${addressOptions.Address_Hamlet},
        ${addressOptions.Address_Home_Number},
        ${addressOptions.Address_Company_User},
        ${addressOptions.Address_User_Id}, 
        ${addressOptions.Address_Company_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addProduct(productOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addProduct 
        ${productOptions.Product_Id}, 
        ${productOptions.Product_Type},
        ${productOptions.Product_Industry},
        ${productOptions.Product_Name},
        ${productOptions.Product_Title},
        ${productOptions.Product_Hastag},
        ${productOptions.Product_Infor_URL},
        ${productOptions.Product_Describe_URL},
        ${productOptions.Product_Price},
        ${productOptions.Product_VAT},
        ${productOptions.Product_Like},
        ${productOptions.Product_Sale},
        ${productOptions.Product_AmountOfSold},
        ${productOptions.Product_Amount},
        ${productOptions.Product_User_Id},
        ${productOptions.Product_Company_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addProductImage(productImageOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addProductImage 
        ${productImageOptions.ProductImage_Id},
        ${productImageOptions.ProductImage_URL},
        ${productImageOptions.ProductImage_Product_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getProduct(productPages, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_product_pagination 
        ${productPages.PageIndex},
        ${productPages.PageSize}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getProductWithOptions(productPages, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_product_pagination_withOptions 
        ${productPages.PageIndex},
        ${productPages.PageSize},
        ${productPages.Product_Type},
        ${productPages.Product_Industry},
        ${productPages.Product_Price1},
        ${productPages.Product_Price2},
        ${productPages.Product_Sale1},
        ${productPages.Product_Sale2}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getProductWithSearch(productPages, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_product_pagination_withSearch 
        ${productPages.PageIndex},
        ${productPages.PageSize},
        ${productPages.Product_Name}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getProductImage(productImagePages, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_productImage_pagination 
        ${productImagePages.Product_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getProductLike(productLikeOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getProductLike 
        ${productLikeOptions.User_Id},
        ${productLikeOptions.Product_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }
    
    disLikeProduct(productLikeOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_disLikeProduct 
        ${productLikeOptions.User_Id},
        ${productLikeOptions.Product_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    likeProduct(productLikeOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_likeProduct 
        ${productLikeOptions.ProductLike_Id},
        ${productLikeOptions.User_Id},
        ${productLikeOptions.Product_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getProductDetail(product_Id, callback) {
        let err;
        let data;
        const promise1 = new Promise((resolve, reject) => {
            this._sql.query `EXEC proc_getProduct_withId
            ${product_Id}`
            .then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
        const promise2 = new Promise((resolve, reject) => {
            this._sql.query `EXEC proc_productImage_pagination 
            ${product_Id}`
            .then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
        Promise.all([promise1, promise2]).then((values) => {
            data = values;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addCart(cartOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addCart 
        ${cartOptions.Cart_Id},
        ${cartOptions.Cart_Type},
        ${cartOptions.Cart_Product_Id},
        ${cartOptions.Cart_User_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getCart(userId, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getCart 
        ${userId}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getChatRoom(chatRoomsOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getChatRoom 
        ${chatRoomsOptions.ChatRooms_User1_Id},
        ${chatRoomsOptions.ChatRooms_User2_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getChatRomms(chatRoomsUserId, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getChatRooms 
        ${chatRoomsUserId}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addChatRoom(chatRoomsOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addChatRoom 
        ${chatRoomsOptions.ChatRomms_Id},
        ${chatRoomsOptions.ChatRooms_User1_Id},
        ${chatRoomsOptions.ChatRooms_User2_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    addMessage(messageOptions, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_addMesage 
        ${messageOptions.Messages_Id},
        ${messageOptions.Messages_ChatRoom_Id},
        ${messageOptions.Messages_Message},
        ${messageOptions.Messages_User_Id},
        ${messageOptions.Messages_Type},
        ${messageOptions.Messages_State}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getMessage(roomId, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getMessages 
        ${roomId}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }

    getMessagePages(messagePages, callback) {
        let err;
        let data;
        this._sql.query `EXEC proc_getMessages_pagination 
        ${messagePages.PageIndex},
        ${messagePages.PageSize},
        ${messagePages.ChatRomms_Id}`
        .then(result => {
            data = result;
        }).catch(error => {
            err = error;
        }).finally(() => {
            callback(err, data);
        })
    }
}

exports.MyQuery = MyQuery;