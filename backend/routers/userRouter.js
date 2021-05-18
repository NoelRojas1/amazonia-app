import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

//Express Async Handler takes care of the loading issue when there are multiple users trying to use the same email and this code ius run.
//This will show the error message on the screen

userRouter.get(
  "/seed",
  expressAsyncHandler(async (request, response) => {
    // await User.remove({}); //This line of code will remove all users from database
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

//  Api to list users ---> returns all users in the collection
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const users = await User.find({});
    response.send(users);
  })
);

//Api to delete users
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id);
    if (user) {
      if (user.isAdmin) {
        response.status(503).send({ message: "Cannot delete an Admin User" });
      } else {
        const deletedUser = await user.remove();
        response.send({
          message: "User deleted successfully",
          user: deletedUser,
        });
      }
    } else {
      response.status(404).send({ message: "User not Found." });
    }
  })
);

//Api to update user information
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const user = await User.findById(request.params.id);
    if (user) {
      user.name = request.body.name || user.name;
      user.email = request.body.email || user.email;
      user.isSeller = request.body.isSeller || user.isSeller;
      user.isAdmin = request.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      response.send({
        message: "User Updated Successfully",
        user: updatedUser,
      });
    } else {
      response.status(404).send({ message: "User not Found" });
    }
  })
);

export default userRouter;
