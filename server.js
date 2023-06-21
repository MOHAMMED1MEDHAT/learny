require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const morgan = require("morgan");
// const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");

const authJwt = require("./util/jwt");
const errorHandler = require("./middlewares/errorHandlerMw");

const app = express();

// // FIXME: ENABLE ON DEPLOYMENT
process.on("uncaughtException", (exception) => {
    console.log("uncaught Exception" + exception);
});
process.on("unhandledRejection", (exception) => {
    console.log("uncaught async Exception" + exception);
});

//mongoose connection setup
//FIXME:change to ATLAS_CONNECTION_STRING
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
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
// app.options("*", cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(authJwt());
// app.use(errorHandler);

//routes
const userRouter = require("./routes/user");
// const authRouter = require("./routes/auth");
const upload = require("./routes/Upload");
const profile = require("./routes/profile");
const trackRouter = require("./routes/track");
const complaintRouter = require("./routes/complaints");
const coursesRouter = require("./routes/courses");
const testRouter = require("./routes/test");
const userTestRouter = require("./routes/userTest");
const userCoursesRouter = require("./routes/userCourses");
const userCertificateRouter = require("./routes/UserCertificates");
const testmonialRouter = require("./routes/testmonials");
const planRouter = require("./routes/plans");
const dashboardRouter = require("./routes/dashboard");
const notificationsRouter = require("./routes/notifications");

app.use("/api/v1/user", userRouter); //test done
// app.use("/api/v1/user", authRouter); //test done
app.use("/api/v1/upload", upload); //test done
app.use("/api/v1/profile", profile); //test done
app.use("/api/v1/track", trackRouter); //test done
app.use("/api/v1/course", coursesRouter); //test done
app.use("/api/v1/test", testRouter); //test
app.use("/api/v1/userTest", userTestRouter); //test
app.use("/api/v1/userCertificate", userCertificateRouter); //test
app.use("/api/v1/complaint", complaintRouter); //test
app.use("/api/v1/userCourse", userCoursesRouter); //test
app.use("/api/v1/testmonial", testmonialRouter); //test
app.use("/api/v1/plan", planRouter); //test
app.use("/api/v1/dashboard", dashboardRouter); //test
app.use("/api/v1/notifications", notificationsRouter); //test

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`listening ....!!! on port:${port}`);
});

/*TODO:
1- customize the validator to work best  for every state
*/

//sockets logic---------------------------
const {
    setUpConnection,
    deleteConnection,
    userSendNotification,
    adminSendNotification,
} = require("./util/socketsHandler");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowEIO: true,
    },
});

io.on("connection", function (socket) {
    console.log("Connected", socket.id);

    socket.on("setUpConnection", async function ({ token, socketId }) {
        try {
            await setUpConnection(token, socketId);
        } catch (error) {
            console.log(error.message);
        }
    });

    socket.on("deleteConnection", async function ({ token, socketId }) {
        try {
            await deleteConnection(token, socketId);
        } catch (error) {
            console.log(error.message);
        }
    });

    socket.on("userSendNotification", async function ({ token, msg }) {
        try {
            const sockets = await userSendNotification(token, msg);
            io.to(sockets).emit("userGetNotification", msg);
        } catch (error) {
            console.log(error.message);
        }
    });

    socket.on("adminSendNotification", async function ({ token, msg }) {
        await adminSendNotification(token, msg);
        io.emit("adminGetNotification", msg);
    });

    socket.on("disconnect", function (msg) {
        console.log("Disconnected");
    });
});
