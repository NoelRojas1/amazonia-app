import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

export default function Product(props) {
  const { product } = props;
  return (
    <div>
      <div key={product._id} className="card">
        <Link to={`/product/${product._id}`}>
          <img className="medium" src={product.image} alt={product.name} />
        </Link>
        <div className="card-body">
          <Link to="product.html">
            <h2>{product.name}</h2>
          </Link>
          <Rating
            rating={product.rating}
            numReviews={product.numReviews}
          ></Rating>
          <div className="row">
            <div class="price">${product.price}</div>
            <div>
              <Link to={`/seller/${product.seller._id}`}>
                {product.seller.seller.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
