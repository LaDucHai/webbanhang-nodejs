const jwt = require('jsonwebtoken');


class MyJwt {
    constructor (key) {
        this._key = key;
    }

    sign (jsonData) {
        return jwt.sign(jsonData, this._key, { expiresIn: 60 * 60 });
    }

    verify (token, callback) {
        jwt.verify(token, this._key, function(err, decoded) {
            if (err) console.error(err);
            callback(decoded);
        });
    }
}

exports.MyJwt = MyJwt;