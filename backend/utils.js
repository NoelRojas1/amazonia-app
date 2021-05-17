import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    //to implement this part (secure token), you need to create a .env file in the root folder, and install a package called "dotenv"
    process.env.JWT_SECRET || "somethingsecret",
    { expiresIn: "30d" }
  );
};

//Middleware to autenticate user to place order
export const isAuth = (request, response, next) => {
  const authorization = request.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (error, decode) => {
        if (error) {
          response.status(401).send({ message: "Invalid Token." });
        } else {
          request.user = decode;
          next();
        }
      }
    );
  } else {
    response.status(401).send({ message: "No Token" });
  }
};

//Middleware to autheticate admin users.
export const isAdmin = (request, response, next) => {
  if (request.user && request.user.isAdmin) {
    next();
  } else {
    response.status(401).send({ message: "Invalid Admin Token" });
  }
};
