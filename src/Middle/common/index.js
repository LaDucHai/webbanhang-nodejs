const handleData = (res, err, data) => {
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
}
module.exports = { handleData }