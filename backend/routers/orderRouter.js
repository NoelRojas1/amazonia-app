import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import {
  isAdmin,
  isAuth,
  isSellerOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from "../utils.js";

const orderRouter = express.Router();

//Api to get orders to dispaly in the Order Window for admin
orderRouter.get(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (request, response) => {
    const seller = request.query.seller || "";
    const sellerFilter = seller ? { seller } : {};
    const orders = await Order.find({ ...sellerFilter }).populate(
      "user",
      "name"
    ); // --> the function .populate works like "join" in sql
    response.send(orders);
  })
);

//Api for dashboard data
orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "totalPrice" },
        },
      },
    ]);

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    response.send({ users, orders, dailyOrders, productCategories });
  })
);

//Api to get orders made by user
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (request, response) => {
    const orders = await Order.find({ user: request.user._id });
    response.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (request, response) => {
    if (request.body.orderItems.length === 0) {
      response.status(400).send({ message: "Cart is empty" });
    } else {
      const order = new Order({
        orderItems: request.body.orderItems,
        shippingAddress: request.body.shippingAddress,
        paymentMethod: request.body.paymentMethod,
        itemsPrice: request.body.itemsPrice,
        shippingPrice: request.body.shippingPrice,
        taxPrice: request.body.taxPrice,
        totalPrice: request.body.totalPrice,
        user: request.user._id,
        seller: request.body.orderItems[0].seller,
      });
      const createdOrder = await order.save();
      response
        .status(201)
        .send({ message: "New Order Created", order: createdOrder });
    }
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id);
    if (order) {
      response.send(order);
    } else {
      response.status(404).send({ message: "Order not Found" });
    }
  })
);

//Use .put because we are checking the status of a resource. This API is to verify that the order has been paid for
orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (request, response) => {
    const order = await await Order.findById(request.params.id).populate(
      "user",
      "email name"
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: request.body.id,
        status: request.body.status,
        update_time: request.body.update_time,
        email_address: request.body.email_address,
      };
      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: "Amazonia <amazonia@mg.amazonia.com>",
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New Order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );
      response.send({ message: "Order Paid", order: updatedOrder });
    } else {
      reposnse.status(404).send({ message: "Order not Found" });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id);
    if (order) {
      const deletedOrder = await order.remove();
      response.send({ message: "Order deleted", order: deletedOrder });
    } else {
      response.status(404).send({ message: "Order not Found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const order = await Order.findById(request.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const deliveredOrder = await order.save();
      response.send({ message: "Order Delivered", order: deliveredOrder });
    } else {
      reposnse.status(404).send({ message: "Order not Found" });
    }
  })
);

export default orderRouter;
