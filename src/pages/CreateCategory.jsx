import React,{useState} from "react";
import { useSelector } from "react-redux";

const ADMIN_EMAIL='two@gmail.com';

const CreateCategory = () => {
    const { user,token } = useSelector((state) => state.auth);

    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState(null);
    const[message,setMessage]=useState(null);
    const handleSubmit=async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            console.log("🔐 Sending token:", token);
            const res=await fetch('https://api.freeapi.app/api/v1/ecommerce/categories',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify({name:categoryName})
            })
            const data= await res.json();
            if(!res.ok){
                throw new Error(data.message || 'Failed to create category');
            }
            setMessage(`✅ Category "${data.data.name}" created successfully!`);
            setCategoryName('');



        } catch (error) {
            setError(`❌ ${error.message}`);
            
        }

    }
    if(!user || user.email !== ADMIN_EMAIL){
        return <p className="text-red-500 text-center mt-4">You are not authorized to create categories.</p>;
    }
    return(
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Category</h2>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-x">
        <input
        type="text"
        value={categoryName}
        onChange={(e)=>setCategoryName(e.target.value)}
        placeholder="Category Name"
        className="w-full p-2 border rounded"
        />
        <button 
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Create Category

        </button>

      </form>
      </div>

    )

}
export default CreateCategory;