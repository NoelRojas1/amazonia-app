import Axios from "axios";
import {
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
} from "../constants/productConstants";

export const listProducts =
  ({ seller = "", name = "" }) =>
  async (dispatch) => {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
    });
    try {
      const { data } = await Axios.get(
        `/api/products?seller=${seller}&name=${name}`
      );
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
    }
  };

export const detailsProduct = (productId) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
  try {
    const { data } = await Axios.get(`/api/products/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = () => async (dispatch, getState) => {
  dispatch({ type: PRODUCT_CREATE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.post(
      "/api/products",
      {},
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.product });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_CREATE_FAIL, paylaod: message });
  }
};

export const updateProduct = (productData) => async (dispatch, useState) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST, paylaod: productData });
  const {
    userSignin: { userInfo },
  } = useState();
  try {
    const { data } = await Axios.put(
      `/api/products/${productData._id}`,
      productData,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_UPDATE_FAIL, error: message });
  }
};

export const deleteProduct = (productId) => async (dispatch, useState) => {
  dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
  const {
    userSignin: { userInfo },
  } = useState();
  try {
    const { data } = await Axios.delete(`/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS, paylaod: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: PRODUCT_DELETE_FAIL, error: message });
  }
};
