import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { updateProduct } from "../slices/productSlice";

const EditProduct = () => {
    const { productId } = useParams();
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const { categories } = useSelector((state) => state.categories);

    const { products, loading } = useSelector((state) => state.products);
    const { user ,token,role} = useSelector((state) => state.auth);
    const product =products.find((item)=> item._id === productId);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryName: '',
        mainImage: null,

    })
    useEffect(()=>{
        if (product){
            setFormData({

                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category?.name,
                mainImage: null, 
            })
        }
    },[ product]);
    if (loading || !product) {
        return <p className="text-center mt-4">Loading...</p>;
    }
    if (user?.role !== "ADMIN"){
        return <p className="text-red-500 text-center mt-4">You are not authorized to edit products.</p>;
    }
    const handleChange=(e)=>{
        const {name,value,files}=e.target;
        if (name==='mainImage'){
            setFormData({
                ...formData,
                mainImage:files[0],
            })
        }else{
            setFormData({
                ...formData,
                [name]:value
            })
        }
    }
const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(updateProduct({productId,updateData:formData,email:user?.email,role,token})).then((res)=>{
        if (!res.error){
            navigate(`/products`)
        }
    })
}
return(
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
        />

<select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full border px-4 py-2 rounded"
>
  <option value="">Select category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="file"
          name="mainImage"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
)

}
export default EditProduct;