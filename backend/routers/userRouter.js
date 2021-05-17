import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken, isAuth } from "../utils.js";

const userRouter = express.Router();

//Express Async Handler takes care of the loading issue when there are multiple users trying to use the same email and this code ius run.
//This will show the error message on the screen

userRouter.get(
  "/seed",
  expressAsyncHandler(async (request, response) => {
    await User.remove({}); //This line of code will remove all users from database
    const createdUsers = await User.insertMany(data.users);
    response.send({ createdUsers });
  })
);

//Router for user signin

userRouter.post(
  "/signin",
  expressAsyncHandler(async (request, response) => {
    const user = await User.findOne({ email: request.body.email });

    if (user) {
      if (bcrypt.compareSync(request.body.password, user.password)) {
        response.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          //To implement generateToken, you need to install "jsonwebtoken" in the root folder
          //Then implement it in a file named utils.js in backend folder
          token: generateToken(user),
        });
        return;
      }
    }
    response.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (request, response) => {
    const user = new User({
      name: request.body.name,
      email: request.body.email,
      password: bcrypt.hashSync(request.body.password, 8),
    });

    const createdUser = await user.save();

    response.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      //To implement generateToken, you need to install "jsonwebtoken" in the root folder
      //Then implement it in a file named utils.js in backend folder
      token: generateToken(createdUser),
    });
  })
);

userRouter.get(
  "/:id",
  expressAsyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id);
    if (user) {
      response.send(user);
    } else {
      response.status(404).send({ message: "User not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (request, response) => {
    const user = await User.findById(request.user._id);
    if (user) {
      user.name = request.body.name || user.name; // || user.name for when the user does not pass a new name
      user.email = request.body.email || user.email;
      if (request.body.password) {
        user.password = bcrypt.hashSync(request.body.password, 8);
      }
      const updatedUser = await user.save();
      response.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      response.status(404).send({ message: "User not Found" });
    }
  })
);

export default userRouter;
