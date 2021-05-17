import express, { response } from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAdmin, isAuth } from "../utils.js";

const orderRouter = express.Router();

//Api to get orders to dispaly in the Order Window for admin
orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const orders = await Order.find({}).populate("user", "name"); // --> the function .populate works like "join" in sql
    response.send(orders);
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
    const order = await Order.findById(request.params.id);
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
