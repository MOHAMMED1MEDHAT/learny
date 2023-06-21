const validator = require("../util/userValidator");

module.exports = (req, res, next) => {
    const vaild = validator(req.body);
    if (vaild) {
        next();
    } else {
        // console.log(req.body);
        res.status(403).send("forbidden comand");
    }
};
