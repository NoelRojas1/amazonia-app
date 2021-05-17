import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Noel",
      email: "admin@example.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: true,
    },
    {
      name: "Jessica",
      email: "jess@example.com",
      password: bcrypt.hashSync("4321", 8),
      isAdmin: false,
    },
  ],
  products: [
    {
      //   _id: "1",
      name: "Nike Hoodie 1",
      category: "clothing",
      image: "../images/product-1.jpg",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "2",
      name: "Nike Sweater 1",
      category: "clothing",
      image: "../images/product-2.jpg",
      price: 100,
      countInStock: 20,
      brand: "Nike",
      rating: 5.0,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "3",
      name: "Nike Boots 1",
      category: "shoes",
      image: "../images/product-3.jpg",
      price: 175,
      countInStock: 30,
      brand: "Nike",
      rating: 5.0,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "4",
      name: "Nike Hoodie 2",
      category: "clothing",
      image: "../images/product-1.jpg",
      price: 120,
      countInStock: 15,
      brand: "Nike",
      rating: 4.0,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "5",
      name: "Nike Hoodie 3",
      category: "clothing",
      image: "../images/product-1.jpg",
      price: 120,
      countInStock: 12,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "6",
      name: "Nike Boots 2",
      category: "shoes",
      image: "../images/product-3.jpg",
      price: 175,
      countInStock: 25,
      brand: "Nike",
      rating: 5.0,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "7",
      name: "Nike Hoodie 4",
      category: "clothing",
      image: "../images/product-1.jpg",
      price: 120,
      countInStock: 10,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "8",
      name: "Nike Sweater 2",
      category: "clothing",
      image: "../images/product-2.jpg",
      price: 100,
      countInStock: 20,
      brand: "Nike",
      rating: 5.0,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "9",
      name: "Nike Boots 3",
      category: "shoes",
      image: "../images/product-3.jpg",
      price: 175,
      countInStock: 17,
      brand: "Nike",
      rating: 5.0,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "10",
      name: "Nike Hoodie 5",
      category: "clothing",
      image: "../images/product-1.jpg",
      price: 120,
      countInStock: 0,
      brand: "Nike",
      rating: 4.0,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "11",
      name: "Nike Hoodie 6",
      category: "clothing",
      image: "../images/product-1.jpg",
      price: 120,
      countInStock: 18,
      brand: "Nike",
      rating: 4.5,
      numReviews: 10,
      description: "High quality product",
    },
    {
      //   _id: "12",
      name: "Nike Boots 4",
      category: "shoes",
      image: "../images/product-3.jpg",
      price: 175,
      countInStock: 5,
      brand: "Nike",
      rating: 5.0,
      numReviews: 10,
      description: "High quality product",
    },
  ],
};

export default data;
