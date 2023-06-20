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
app.use("/api/v1/usertest", userTestRouter); //test
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
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSCRT = config.get("env_var.jwtScreteKey");

const User = require("./models/userModel");

const io = require("socket.io")(server);

io.on("connection", function (socket) {
    console.log("Connected", socket.id);

    socket.on("setUpConnection", async function ({ token, socketId }) {
        const { userId } = jwt.verify(token, jwtSCRT);
        let sockets = (await User.findById(userId)).sockets;
        //TODO:change it to socketId from client
        sockets.push(socket.id);
        await User.findByIdAndUpdate(userId, {
            sockets,
        });
        console.log(
            `socketId:${socketId} was add to userId:${userId} and sockets:${sockets}`
        );
    });

    socket.on("deleteConnection", async function ({ token, socketId }) {
        const { userId } = jwt.verify(token, jwtSCRT);
        let sockets = (await User.findById(userId)).sockets;
        //TODO:change it to socketId from client
        if (sockets.indexOf(socket.id) != -1) {
            sockets.splice(sockets.indexOf(socket.id), 1);
        } else {
            console.log(socket.id, "Not found");
        }
        await User.findByIdAndUpdate(userId, {
            sockets,
        });
        console.log(
            `socketId:${socketId} was removed from userId:${userId} and sockets:${sockets}`
        );
    });

    socket.on("userSendNotification", async function ({ token, msg }) {
        const { userId } = jwt.verify(token, jwtSCRT);
        let sockets = (await User.findById(userId)).sockets;

        const admins = await User.find({ isAdmin: true });
        const adminsSockets = admins.map((admin) => admin.sockets);
        adminsSockets.map((adminSocket) => sockets.concat(adminSocket));

        io.to(sockets).emit("getNotification", msg);
    });

    socket.on("adminSendNotification", async function ({ msg }) {
        io.emit("getNotification", msg);
    });

    socket.on("msg_from_client", function (from, msg) {
        console.log("Message is " + from, msg);
    });
    socket.on("disconnect", function (msg) {
        console.log("Disconnected");
    });
});

let count = 0;
setInterval(function () {
    io.emit("msg_to_client", "client", "test msg" + count);
    count++;
}, 1000);
