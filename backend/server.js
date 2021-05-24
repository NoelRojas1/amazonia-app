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
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
