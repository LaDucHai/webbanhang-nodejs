"use strict";

/** 
*@typedef {
*UserId: string,
*AccountName: string,
*Password: string,
*Email: string,
*Phone: string,
*FirstName: string,
*LastName: string,
*Birthday: string,
*Sex: string
*} SignupOptions, // as: InformationOptions
*/

/** 
*@typedef {
*AccountName: string,
*Password: string,
*} LoginOptions
*/


class MyQuery {

    constructor(sql) {
        this._sql = sql;
    }

    async signup(signupOptions) {
        await this._sql.query `EXEC proc_signup 
        ${signupOptions.UserId}, 
        ${signupOptions.AccountName}, 
        ${signupOptions.Password}, 
        ${signupOptions.Phone}, 
        ${signupOptions.Email}, 
        ${signupOptions.FirstName}, 
        ${signupOptions.LastName}, 
        ${signupOptions.Birthday}, 
        ${signupOptions.Sex}`;
    }

    async login(loginOptions) {
        let a = await this._sql.query `EXEC proc_login ${loginOptions.AccountName}, ${loginOptions.Password}`;
        return a;
    }
}

exports.MyQuery = MyQuery;