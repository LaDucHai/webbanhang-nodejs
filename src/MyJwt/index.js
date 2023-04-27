const jwt = require('jsonwebtoken');


class MyJwt {
    constructor (key, encodeString) {
        this._key = key;
        this._encodeString = encodeString;
    }

    sign(jsonData) {
        return jwt.sign(jsonData, this._key, { expiresIn: 60 * 60 * 24 });
    }

    verify(token, callback) {
        const token1 = token && token.split(" ");
        if (token1[0] === this._encodeString) {
            jwt.verify(token1[1], this._key, function(err, decoded) {
                callback(err, decoded);
            });
        }
    }
}

exports.MyJwt = MyJwt;