import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { signout } from "./actions/userActions";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import CartWindow from "./windows/CartWindow";
import HomeWindow from "./windows/HomeWindow";
import OrderDetailWindow from "./windows/OrderDetailWindow";
import OrderHistoryWindow from "./windows/OrderHistoryWindow";
import PaymentMethodWindow from "./windows/PaymentMethodWindow";
import PlaceOrderWindow from "./windows/PlaceOrderWindow";
import ProductListWindow from "./windows/ProductListWindow";
import ProductWindow from "./windows/ProductWindow";
import ProfileWindow from "./windows/ProfileWindow";
import RegisterWindow from "./windows/RegisterWindow";
import ShippingAddressWindow from "./windows/ShippingAddressWindow";
import SigninWindow from "./windows/SigninWindow";
import ProductEditWindow from "./windows/ProductEditWindow";
import OrderListWindow from "./windows/OrderListWindow";

function App() {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              amazonia
            </Link>
          </div>
          <div>
            <Link to="/cart">
              Cart{" "}
              {cartItems.length > 0 ? (
                <span className="badge">
                  <i className="fa fa-shopping-cart">
                    &nbsp;{cartItems.length}
                  </i>
                </span>
              ) : (
                <i className="fa fa-shopping-cart"></i>
              )}
            </Link>
            {userInfo ? (
              <div className="dropdown">
                <Link to="#">
                  {userInfo.name} <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/orderhistory">Order History</Link>
                  </li>
                  <li>
                    <Link to="#signout" onClick={signoutHandler}>
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <Link to="#admin">
                  Admin <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/productlist">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist">Orders</Link>
                  </li>
                  <li>
                    <Link to="/userlist">Users</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <main>
          <Route path="/" component={HomeWindow} exact></Route>
          <Route path="/product/:id" component={ProductWindow} exact></Route>
          <Route
            path="/product/:id/edit"
            component={ProductEditWindow}
            exact
          ></Route>
          <Route path="/signin" component={SigninWindow}></Route>
          <Route path="/register" component={RegisterWindow}></Route>
          <Route path="/cart/:id?" component={CartWindow}></Route>
          <Route path="/shipping" component={ShippingAddressWindow}></Route>
          <Route path="/payment" component={PaymentMethodWindow}></Route>
          <Route path="/placeorder" component={PlaceOrderWindow}></Route>
          <Route path="/order/:id" component={OrderDetailWindow}></Route>
          <Route path="/orderhistory" component={OrderHistoryWindow}></Route>
          <PrivateRoute
            path="/profile"
            component={ProfileWindow}
          ></PrivateRoute>
          <AdminRoute
            path="/productlist"
            component={ProductListWindow}
          ></AdminRoute>
          <AdminRoute
            path="/orderlist"
            component={OrderListWindow}
          ></AdminRoute>
        </main>
        <footer className="row center">
          <p>All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
