import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  deleteProduct,
  listProducts,
} from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from "../constants/productConstants";

export default function ProductListWindow(props) {
  const sellerMode = props.match.path.indexOf("/seller") >= 0;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const newProduct = useSelector((state) => state.productCreate);
  const {
    loading: loadingNewProduct,
    error: errorNewProduct,
    product: createdProduct,
    success: successNewProduct,
  } = newProduct;

  const deletedProduct = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = deletedProduct;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successNewProduct) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(listProducts({ seller: sellerMode ? userInfo._id : "" }));
  }, [
    dispatch,
    successNewProduct,
    createdProduct,
    props.history,
    successDelete,
    sellerMode,
    userInfo._id,
  ]);

  const deleteHandler = (product) => {
    //TODO: dispatch delete action
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      dispatch(deleteProduct(product._id));
    }
  };

  const createHandler = () => {
    //TODO: dispatch create product action
    dispatch(createProduct());
  };

  return (
    <div>
      <div className="row">
        <h1>Product List</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Create New Product
        </button>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loadingNewProduct && <LoadingBox></LoadingBox>}
      {errorNewProduct && (
        <MessageBox variant="danger">{errorNewProduct}</MessageBox>
      )}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/product/${product._id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      deleteHandler(product);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
