module.exports = (err, res, next) => {
    if (!err) {
        next();
    } else {
        // const errMessage = err.inner.message;
        return res.status(500).json({
            message: "Internal server error ",
            errorMessage: err.message,
        });
    }
};
