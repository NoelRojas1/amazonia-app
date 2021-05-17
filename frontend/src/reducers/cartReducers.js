import {
  CART_ADD_ITEM,
  CART_EMPTY,
  CART_ITEM_DELETE,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHOPPING_ADDRESS,
} from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }

    case CART_ITEM_DELETE:
      // (...state) is used when no other properties need to be changed
      return {
        ...state,
        //filter out the product whose id it the same as action.payload
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };

    case CART_SAVE_SHOPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    case CART_EMPTY:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};
