module.exports = (err, req, res, next) => {
    if (!err) {
        next();
    } else {
        // const errMessage = err.inner.message;
        return res.status(500).json({ message: "Internal server error", err });
    }
};
