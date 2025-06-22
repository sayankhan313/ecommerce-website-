import React,{useEffect} from "react";
import  {useDispatch, useSelector} from "react-redux";
import { fetchProducts } from "../slices/productSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { addorUpdateCartItem } from "../slices/cartSlice";

const Product = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.products);
    const{token} = useSelector((state) => state.auth);
    useEffect(()=>{
        dispatch(fetchProducts());

    },[dispatch]);
const handleAddToCart=(productId)=>{
if(!token){
    alert("Please login to add items to cart");
    return;
}
dispatch(addorUpdateCartItem({productId,quantity:1}))
}

    if (loading) return <p className="text-center mt-4">Loading...</p>;
    if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
    return(
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Products</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product)=>{
                    return(
                        <div key={product._id} className="border rounded p-4">
                            <img src={product.mainImage?.url}
                            alt={product.name}
                            className="w-full h-48 object-cover mb-4 rounded" 
                            />
                            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-2">{product.description}</p>
                            <p className="text-xl font-bold mb-2">${product.price}</p>
                            <Link to={`/products/${product._id}`} className="text-blue-600 mt-2 inline-block">
                            View Details

                            </Link>
                            <button
              onClick={() => handleAddToCart(product._id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              Add to Cart
            </button>
                            
                        </div>
                    )
                })

                }
             </div>
        </div>
    )
}
export default Product;