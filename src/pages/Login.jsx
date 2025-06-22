import React from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useState } from 'react'
import { LoginUser } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [credentials, setCredentials] = useState({
        username:'',
        password:'',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading,error,user} = useSelector((state)=>state.auth);
    const handleChange=((e)=>{
        setCredentials({
            ...credentials,
            [e.target.name]:e.target.value
        })
    })
    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(LoginUser(credentials)).then((res)=>{
            if (!res.error){
                navigate('/products');
            }
        })
      
    }
    return(
        <div className='max-w-md mx-auto mt-10 p-4 border rounded shadow '>
           <h2 className='text-2xl font-bold mb-4'>Login</h2>
           {error && <p className='text-red-500'>{error}</p>}
           {user && <p className='text-green-500'> Welcome back,{user.username}</p>} 
           <form onSubmit={handleSubmit} className='space-y-4'>
               <input
               className='w-full p-2 border rounded'
               type='text'
               name='username'
               placeholder='Username'
               onChange={handleChange}
               />
               <input
               className='w-full p-2 border rounded'
               type='password'
               name='password'
               placeholder='Password'
               onChange={handleChange}
               />
               <button className='bg-blue-600 text-white px-4 py-2 rounded'
               type='submit '
               disabled={loading}>
                   {loading? 'Logging in...': 'Login'}
               </button>
               </form>

        </div>
    )
}
export default Login