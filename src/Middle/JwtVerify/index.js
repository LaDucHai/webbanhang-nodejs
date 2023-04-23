const jwt = require('jsonwebtoken');
const { TOKENENCODESTRING, TOKENKEY } = require('../../Constant/index');

const JwtVerify = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const token1 = token && token.split(" ");
        if (token1[0] === TOKENENCODESTRING) {
            jwt.verify(token1[1], TOKENKEY, function(err, decoded) {
                if (err) {
                    res.send({
                        state: false,
                        err: err
                    });
                } else {
                    decoded && next();
                }
            });
        }
    } catch (err) {
        res.send({
            state: false,
            err: { err }
        });
    }
}

module.exports = { JwtVerify }