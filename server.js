require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");

const authJwt = require("./util/jwt");
// const dateCalc = require("./util/dateCalculations");
const errorHandler = require("./middlewares/errorHandlerMw");

const app = express();

process.on("uncaughtException", (exception) => {
    console.log("uncaught Exception" + exception);
});
process.on("unhandledRejection", (exception) => {
    console.log("uncaught async Exception" + exception);
});
//mongoose connection setup
mongoose
    .connect(process.env.LOCAL_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "E-learnig",
    })
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) => console.log("error occured" + err));

//adding a CSP to secure from XSS
// app.use(helmet.contentSecurityPolicy({
// }));
// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', "default-src 'self'");
//     next();
// });

//middlewares
app.use(cors());
app.options("*", cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//routes
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const upload = require("./routes/Upload");
// const searchRouter = require("./routes/search");
// const profileRouter = require("./routes/profile");
// const notificationRouter = require("./routes/notification");
// // const mainPageRouter=require("./routes/mainpage")
// const appointmentRouter = require("./routes/appointment");
// const clinickRouter = require("./routes/clinick");

app.use("/api/user/signup", userRouter); //test done
app.use("/api/user", authRouter); //test done
app.use("/api/upload", upload);
// app.use("/api/search", searchRouter); //test done
// app.use("/api/profile", profileRouter); //test done
// // app.use("/api/mainPage",mainPageRouter);
// app.use("/api/appointments", appointmentRouter); // test done
// app.use("/api/clinicks", clinickRouter); //test done
// app.use("/api/notification", notificationRouter); //test done

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening ....!!! on port:${port}`);
});

/*TODO:

*/
