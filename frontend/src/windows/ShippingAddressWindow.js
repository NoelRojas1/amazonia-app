import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

export default function ShippingAddressWindow(props) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  if (!userInfo) {
    props.history.push("/signin");
  }

  const [fullName, setFullName] = useState(shippingAddress.fullName);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [zipCode, setZipCode] = useState(shippingAddress.zipCode);
  const [country, setCountry] = useState(shippingAddress.country);
  //   const [location, setLocation] = useState("");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    //TODO: Handler event... Dispatch save shipping address action
    dispatch(
      saveShippingAddress({ fullName, address, city, zipCode, country })
    );
    props.history.push("/payment");
  };

  return (
    <div>
      <div>
        <CheckoutSteps step1 step2></CheckoutSteps>
      </div>
      <div>
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Shipping Address</h1>
          </div>
          <div>
            <lable htmlFor="fullName">Full Name</lable>
            <input
              type="text"
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
            ></input>
          </div>
          <div>
            <lable htmlFor="address">Address</lable>
            <input
              type="text"
              id="address"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></input>
          </div>
          <div>
            <lable htmlFor="city">City</lable>
            <input
              type="text"
              id="city"
              placeholder="Enter City"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            ></input>
          </div>
          <div>
            <lable htmlFor="zipCode">Zip Code</lable>
            <input
              type="text"
              id="zipCode"
              placeholder="Enter Zip code"
              value={zipCode}
              required
              onChange={(e) => setZipCode(e.target.value)}
            ></input>
          </div>
          <div>
            <lable htmlFor="country">Country</lable>
            <input
              type="text"
              id="country"
              placeholder="Enter Country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            ></input>
          </div>
          {/* <div>
            <lable htmlFor="location">Location</lable>
            <input
              type="text"
              id="location"
              placeholder="Enter full name"
              required
              onChange={(e) => setLocation(e.target.value)}
            ></input>
          </div> */}
          <div>
            <label />
            <button className="primary" type="submit">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
