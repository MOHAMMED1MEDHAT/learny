require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const morgan = require("morgan");
// const helmet = require("helmet");
const cors = require("cors");
const express = require("express");

const authJwt = require("./util/jwt");
const errorHandler = require("./middlewares/errorHandlerMw");

const app = express();

//FIXME: ENABLE ON DEPLOYMENT
process.on("uncaughtException", (exception) => {
    console.log("uncaught Exception" + exception);
});
process.on("unhandledRejection", (exception) => {
    console.log("uncaught async Exception" + exception);
});

//mongoose connection setup
mongoose
    .connect(process.env.ATLAS_CONNECTION_STRING, {
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
const trackRouter = require("./routes/track");
const complaintRouter = require("./routes/complaints");
const coursesRouter = require("./routes/courses");
const userCoursesRouter = require("./routes/userCourses");
const testmonialRouter = require("./routes/testmonials");
const planRouter = require("./routes/plans");

app.use("/api/v1/user/signup", userRouter); //test done
app.use("/api/v1/user", authRouter); //test done
app.use("/api/v1/upload", upload); //test done
app.use("/api/v1/track", trackRouter); //test
app.use("/api/v1/complaint", complaintRouter); //test
app.use("/api/v1/course", coursesRouter); //test
app.use("/api/v1/userCourse", userCoursesRouter); //test
app.use("/api/v1/testmonial", testmonialRouter); //test
app.use("/api/v1/plan", planRouter); //test

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening ....!!! on port:${port}`);
});

/*TODO:
1- customize the validator to work best  for every state
*/
