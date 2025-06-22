import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../slices/productSlice";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../slices/categorySlice";

const ADMIN_EMAIL = "two@gmail.com";

const CreateProduct = () => {
  const { user, token } = useSelector((state) => state.auth);
  const {categories,loading,error}= useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    dispatch(fetchCategories())
  },[dispatch])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    mainImage: null,
    subImages: []
  });

  

  if (!user || user?.email !== ADMIN_EMAIL) {
    return <p className="text-red-500 text-center mt-4">You are not authorized to create products.</p>;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "mainImage") {
      setFormData({ ...formData, mainImage: files[0] });
    } else if (name === "subImages") {
      setFormData({ ...formData, subImages: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const productForm = new FormData();
    productForm.append("name", formData.name);
    productForm.append("description", formData.description);
    productForm.append("price", Number(formData.price));
    productForm.append("stock", Number(formData.stock));
    productForm.append("category", formData.category);
    productForm.append("mainImage", formData.mainImage);

  


    dispatch(createProduct({ formData: productForm, token })).then(res => {
      if (!res.error) {
        navigate("/products");
      } else {
        console.error("❌ Failed to create product:", res.error);
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {['name', 'description', 'price', 'stock'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={`Enter ${field}`}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        ))}

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="file"
          name="mainImage"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
