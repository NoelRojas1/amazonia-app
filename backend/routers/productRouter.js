import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import data from "../data.js";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

const productRouter = express.Router();

//api to send list of products to front end
productRouter.get(
  "/",
  expressAsyncHandler(async (request, response) => {
    const name = request.query.name || "";
    const seller = request.query.seller || "";
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const sellerFilter = seller ? { seller } : {};
    //.find({}) means "return all products for the current admin or seller"
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
    }).populate("seller", "seller.name seller.logo");
    response.send(products);
  })
);

//api for mongo db to create the initial products based on data.products
productRouter.get(
  // At this point we can get rid of the product id of the static file data.js because MongoDB will automatically assign an id to each product
  "/seed",
  expressAsyncHandler(async (resquest, response) => {
    // await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    response.send({ createdProducts });
  })
);

//Api for product details return to front end
productRouter.get(
  "/:id",
  expressAsyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id).populate(
      "seller",
      "seller.name seller.logo seller.rating seller.numReviews"
    );

    if (product) {
      response.send(product);
    } else {
      response.status(404).send({ message: "Product not Found" });
    }
  })
);

//Api for craeting a new product
productRouter.post(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (request, response) => {
    const product = new Product({
      name: "sample name" + Date.now(),
      seller: request.user._id,
      image: "../images/product-1.jpg",
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",
    });
    const createdProduct = await product.save();
    response.send({ message: "Product created", product: createdProduct });
  })
);

//Api to update product
productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (request, response) => {
    const productId = request.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = request.body.name;
      product.price = request.body.price;
      product.image = request.body.image;
      product.countInStock = request.body.countInStock;
      product.category = request.body.category;
      product.brand = request.body.brand;
      product.description = request.body.description;
      const updatedProduct = await product.save();
      response.send({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      response.status(404).send({ message: "Product not Found" });
    }
  })
);

//Api to delete product for admins
productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (request, response) => {
    const product = await Product.findById(request.params.id);
    if (product) {
      const deletedProduct = await product.remove();
      resposse.send({ message: "Product deleted!", product: deletedProduct });
    } else {
      response.status(404).send({ message: "Product not Found." });
    }
  })
);

export default productRouter;
