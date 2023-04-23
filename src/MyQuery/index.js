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



class MyQuery {

    constructor(sql) {
        this._sql = sql;
    }

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
}

exports.MyQuery = MyQuery;