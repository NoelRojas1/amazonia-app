import React, { useEffect, useState } from "react";
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
import UserListWindow from "./windows/UserListWindow";
import UserEditWindow from "./windows/UserEditWindow";
import SellerRoute from "./components/SellerRoute";
import SellerWindow from "./windows/SellerWindow";
import SearchBox from "./components/SearchBox";
import SearchWindow from "./windows/SearchWindow";
import { listProductCategories } from "./actions/productActions";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";

function App() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const { loading, error, categories } = productCategoryList;
  console.log(categories);
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };

  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link className="brand" to="/">
              amazonia
            </Link>
          </div>
          <div>
            {/* Pass react-dom properties to the seacrh box using the render function */}
            <Route
              render={({ history }) => (
                <SearchBox history={history}></SearchBox>
              )}
            ></Route>
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
            {userInfo && userInfo.isSeller && (
              <div className="dropdown">
                <Link to="#seller">
                  Seller <i className="fa fa-caret-down"></i>
                </Link>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/productlist/seller">Products</Link>
                  </li>
                  <li>
                    <Link to="/orderlist/seller">Orders</Link>
                  </li>
                </ul>
              </div>
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
        <aside className={sidebarIsOpen ? "open" : ""}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              categories !== undefined &&
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>
          <Route path="/seller/:id" component={SellerWindow}></Route>
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
          <Route
            path="/search/name/:name?"
            component={SearchWindow}
            exact
          ></Route>
          <Route
            path="/search/category/:category"
            component={SearchWindow}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name"
            component={SearchWindow}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min"
            component={SearchWindow}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max"
            component={SearchWindow}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating"
            component={SearchWindow}
            exact
          ></Route>
          <Route
            path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order"
            component={SearchWindow}
            exact
          ></Route>
          <PrivateRoute
            path="/profile"
            component={ProfileWindow}
          ></PrivateRoute>
          <AdminRoute
            path="/productlist"
            component={ProductListWindow}
            exact
          ></AdminRoute>
          <AdminRoute
            path="/orderlist"
            component={OrderListWindow}
            exact
          ></AdminRoute>
          <AdminRoute path="/userlist" component={UserListWindow}></AdminRoute>
          <AdminRoute
            path="/user/:id/edit"
            component={UserEditWindow}
          ></AdminRoute>
          <SellerRoute
            path="/productlist/seller"
            component={ProductListWindow}
          ></SellerRoute>
          <SellerRoute
            path="/orderlist/seller"
            component={OrderListWindow}
          ></SellerRoute>
        </main>
        <footer className="row center">
          <p>All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
