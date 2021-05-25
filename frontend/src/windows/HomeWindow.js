import React, { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { listTopSellers } from "../actions/userActions";
import { Link, useParams } from "react-router-dom";

export default function HomeWindow() {
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  // React hooks are not needed anymore because we are using redux store now
  const { pageNumber = 1 } = useParams();

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const topSellerList = useSelector((state) => state.userTopSellersList);
  const {
    loading: loadingTopSellers,
    error: errorTopSellers,
    users: sellers,
  } = topSellerList;

  useEffect(() => {
    // const fetchData = async () => {
    //     setLoading(true);
    //     try {
    //         const { data } = await axios.get('/api/products');
    //         setLoading(false);
    //         setProducts(data);
    //     } catch (error) {
    //         setError(error.message);
    //         setLoading(false);
    //     }
    // };
    // fetchData();
    // fetchData is not neccessary either because of the redux store
    dispatch(listProducts({ pageNumber }));
    dispatch(listTopSellers());
  }, [dispatch, pageNumber]);
  return (
    <div>
      <h2>Top Sellers</h2>
      {loadingTopSellers ? (
        <LoadingBox></LoadingBox>
      ) : errorTopSellers ? (
        <MessageBox variant="danger">{errorTopSellers}</MessageBox>
      ) : (
        <>
          {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name}></img>
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2>Featured Products</h2>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>No Products Found</MessageBox>}
          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product}></Product>
            ))}
          </div>
          <div className="pagination row center">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
