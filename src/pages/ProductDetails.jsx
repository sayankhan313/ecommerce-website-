import React,{useState,useEffect} from "react";
import { useParams,useNavigate, data } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { deleteProduct } from "../slices/productSlice";
import { Link } from "react-router-dom";
 const ProductDetails = () => {
    const{productId}= useParams();
    const [categories, setCategories] =useState([]);
    useEffect(() => {
      fetch('https://api.freeapi.app/api/v1/ecommerce/categories')
      .then((res)=> res.json())
      .then((data)=>{
        const fetchedCategories=data?.data?.categories||[];
        setCategories(fetchedCategories);
      }).catch((err)=>{
        console.error("❌ Failed to fetch categories", err);
      })
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {products,loading} = useSelector((state)=>state.products);
    const {user,token } = useSelector((state) => state.auth);
    const product=products.find((item)=>item._id=== productId);
    const handleDelete = () => {
        const confirm=window.confirm("Are you sure you want to delete this product?");
        if(confirm){
            dispatch(deleteProduct({productId, token}))
            .then((res)=>{
                if(!res.error){
                    navigate('/products');
                }
            })
        }
    }
    if (loading || !product) {
        return <p className="text-center mt-4">Loading...</p>;
    }
    return(
        <div className="max-w-3xl mx-auto px-4 py-8">
        <img
          src={product.mainImage?.url}
          alt={product.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="mb-2"><strong>Category:</strong> 
        {categories.find((cat) => cat._id === product.category)?.name || "Unknown"}
        </p>
        <p className="mb-2"><strong>Stock:</strong> {product.stock}</p>
        <p className="text-xl font-bold mb-4">${product.price}</p>
        {user?.email=='two@gmail.com' &&(
            <div className="flex gap-4">
                
                <Link
      to={`/products/${product._id}/edit`}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Edit
    </Link>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded"
          >Delete</button>
                </div>
        )}
      </div>
    )



 }
 export default ProductDetails;