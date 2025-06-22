import {useDispatch, useSelector} from 'react-redux';
import { useState} from 'react';
import { registerUser,LoginUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
const Register=()=>{
    const [formData, setFormData] = useState({
        email:'',
        password: '',
        username: '',
        

    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading,error,user }=useSelector((state)=>state.auth);


    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
        
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(registerUser(formData)).then((res) => {
            if (!res.error) {
              const credentials = {
                email: formData.email,
                password: formData.password
              };
          
              dispatch(LoginUser(credentials)).then((loginRes) => {
                if (!loginRes.error) {
                  navigate("/"); // ✅ redirect anywhere: /dashboard, /products, etc.
                } else {
                  console.error("Auto-login failed", loginRes.error);
                }
              });
            } else {
              console.error("Registration failed", res.error);
            }
          });
          
    }
    return(
        <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow ">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className='text-red-500'>{error}</p>}
            {user && <p className='text-green-500'>Welcome ,{user.username}</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <input
                className='w-full p-2 border rounded'
                type='email'
                name='email'
                value={formData.email}
                placeholder='Email'
                onChange={handleChange}
                
                />
                <input
                className='w-full p-2 border rounded'
                type='text'
                name='username'
                placeholder='Username'
                value={formData.username}
                onChange={handleChange}
                
                />
                <input
                className='w-full p-2 border rounded'
                type='password'
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                />
                <button className='bg-blue-600 text-white px-4 py-2 rounded'
                type='submit '
                disabled={loading}>
                    {loading? 'Registering...': 'Register'}

                </button>
            </form>
        </div>
    )
}
 export default Register; 