sendErrorDev = (err, res) => {
    res.status(500).json({
        status: "fail",
        errorMassage: err.message,
        errorStack: err.stack,
    });
};

sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(500).json({
            status: "fail",
            errorMassage: err.message,
            errorStack: err.stack,
        });
    } else {
        res.status(500).json({
            status: "fail",
            errorMassage: "Something went wrong",
        });
    }
};

module.exports = (err, res, next) => {
    if (!err) {
        next();
    } else {
        console.log(err);
        if (process.env.NODE_ENV === "development") {
            sendErrorDev(err, res);
        } else if (process.env.NODE_ENV === "production") {
            sendErrorProd(err, res);
        }
    }
};
