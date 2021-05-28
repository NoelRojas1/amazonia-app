import jwt from "jsonwebtoken";
import mg from "mailgun-js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
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

//Middleware to authenticate admin users.
export const isAdmin = (request, response, next) => {
  if (request.user && request.user.isAdmin) {
    next();
  } else {
    response.status(401).send({ message: "Invalid Admin Token" });
  }
};

//Middleware to autehnticate seller users
export const isSeller = (request, response, next) => {
  if (request.user && request.user.isSeller) {
    next();
  } else {
    response.status(401).send({ message: "Invalid Seller Token" });
  }
};

//Middleware to autehnticate seller or admin  users
export const isSellerOrAdmin = (request, response, next) => {
  if (request.user && (request.user.isSeller || request.user.isAdmin)) {
    next();
  } else {
    response.status(401).send({ message: "Invalid Admin/Seller Token" });
  }
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<h1>Thanks for shopping with us</h1>
  <p>Hi ${order.user.name},</p>
  <p>We have finished processing your order.</p>
  <h2>[Order ${order._id} (${order.createdAt.toString().substring(0, 10)})]</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  <td></td>
  </tr>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td align="center">${item.qty}</td>
        <td align="right">$${item.price.toFixed(2)}</td>
      </tr>`
    )
    .join("\n")}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right">$${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Tax Price:</td>
  <td align="right">$${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right">$${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Total Price:</strong></td>
  <td align="right"><strong>$${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </tfoot>
  </table>
  <h2>Shipping Address</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.zipCode},<br/>
  </p>
  <p>Thank you for shopping with us.</p>
  `;
};
