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
    //To implement pagination
    const pageSize = 6;
    const page = Number(request.query.pageNumber) || 1;

    const name = request.query.name || "";
    const category = request.query.category || "";
    const seller = request.query.seller || "";
    const order = request.query.order || "";
    const min =
      request.query.min && Number(request.query.min) !== 0
        ? Number(request.query.min)
        : 0;
    const max =
      request.query.max && Number(request.query.max) !== 0
        ? Number(request.query.max)
        : 0;
    const rating =
      request.query.rating && Number(request.query.rating) !== 0
        ? Number(request.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    //gte = grater than or equal to. lte = less than or equal to
    //.find({}) means "return all products for the current admin or seller"
    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 };

    const count = await Product.countDocuments({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate("seller", "seller.name seller.logo")
      .sort(sortOrder)
      .skip(pageSize * (page - 1)) //For pagination
      .limit(pageSize); //For pagination
    response.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

//Api to get the product categories
productRouter.get(
  "/categories",
  expressAsyncHandler(async (request, response) => {
    const categories = await Product.find().distinct("category");
    response.send(categories);
  })
);

//api for mongo db to create the initial products based on data.products
productRouter.get(
  // At this point we can get rid of the product id of the static file data.js because MongoDB will automatically assign an id to each product
  "/seed",
  expressAsyncHandler(async (resquest, response) => {
    // await Product.remove({});
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map((product, index) => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(data.products);
      response.send({ createdProducts });
    } else {
      response
        .status(500)
        .send({ message: "No seller found. First run /api/users/seed" });
    }
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

//Api to leaving a review
productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (request, response) => {
    const productId = request.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === request.user.name)) {
        return response
          .status(400)
          .send({ message: "You already submitted a review" });
      }
      const review = {
        name: request.user.name,
        comment: request.body.comment,
        rating: Number(request.body.rating),
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce(
          (accumulator, current) => current.rating + accumulator,
          0
        ) / product.reviews.length;
      const updatedProduct = await product.save();
      response.status(201).send({
        message: "Review Created Successfully",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      response.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
