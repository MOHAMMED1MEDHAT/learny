module.exports = (err, res, next) => {
    if (!err) {
        next();
    } else {
        // const errMessage = err.inner.message;
        return res.status(500).json({
            status: "fail",
            message: "Internal server error ",
            errorMessage: err.message,
        });
    }
};
