import http from "http";
import { Server } from "socket.io";
import express from "express";
import mongoose from "mongoose";
// The extensention .js needs to be appended in the backend as opposed to not needing it in frontend folder files
// import data from "./data.js"; --> Not needed after connecting to database
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import dotenv from "dotenv";
import path from "path";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to database
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/amazonia", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// This static data is not needed anymore after connecting MongoDB
// app.get("/api/products/:id", (request, response) => {
//   const product = data.products.find((x) => x._id === request.params.id);
//   if (product) {
//     response.send(product);
//   } else {
//     response.status(404).send({ message: "Product not Found" });
//   }
// });

// This static data is not needed anymore after connecting MongoDB
// app.get("/api/products", (request, response) => {
//   response.send(data.products);
// });

//Api for image upload
app.use("/api/uploads", uploadRouter);

//Api for users
app.use("/api/users", userRouter);

//Api for poroducts
app.use("/api/products", productRouter);

//Api for orders
app.use("/api/orders", orderRouter);

//Api for paypal client id
app.get("/api/config/paypal", (request, response) => {
  response.send(process.env.PAYPAL_CLIENT_ID || "sb"); //sb == > sandbox
});

//Api for google maps
app.get("/api/config/google", (request, response) => {
  response.send(process.env.GOOGLE_API_KEY || "");
});

//To show images in the front-end/browser
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//To show on live website heroku app
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (request, response) =>
  response.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

//After creating the build folder, this is not needed. Build folder was created by react when publiching to heroku
// app.get("/", (request, response) => {
//   response.send("Server is ready");
// });

//This middleware sends th error message to front end from express async handlers in the routers

app.use((error, request, response, next) => {
  response.status(500).send({ message: error.message });
});

const port = process.env.PORT || 5000;

const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const users = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      console.log("Offline", user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit("updateUser", user);
      }
    }
  });

  socket.on("onLogin", (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };

    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    console.log("Online", user.name);
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      io.to(admin.socketId).emit("updatedUser", updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit("listUsers", users);
    }
  });

  socket.on("onUserSelected", (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit("selectUser", existUser);
    }
  });

  socket.on("onMessage", (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online);
      if (user) {
        io.to(user.socketId).emit("message", message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit("message", message);
        const user = users.find((x) => x._id === message._id && x.online);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit("message", {
          name: "Admin",
          body: "Sorry. I am not online right now",
        });
      }
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

// app.listen(port, () => {
//   console.log(`Serve at http://localhost:${port}`);
// });
