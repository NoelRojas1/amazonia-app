import React, { useEffect } from 'react';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

export default function HomeWindow() {
    // const [products, setProducts] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(false);
    // React hooks are not needed anymore because we are using redux store now
    const dispatch = useDispatch();
    const productList = useSelector( state => state.productList );
    const { loading, error, products } = productList;
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
        dispatch(listProducts());
    }, [dispatch]);
    return (
        <div>
            {loading? ( <LoadingBox></LoadingBox> ) 
            : error? ( <MessageBox variant="danger">{error}</MessageBox> )
            : ( <div className="row center">
                {products.map((product) => (
                    <Product key={product._id} product={product}></Product>
                ))}
            </div> )}
        </div>
    );
}