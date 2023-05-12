const validator = require("../util/trackValidator");

module.exports = (req, res, next) => {
    const valid = validator(req.body);
    if (valid) {
        next();
    } else {
        res.status(403).json({ message: "forbidden command" });
    }
};
