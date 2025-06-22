import React,{useEffect} from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart,addorUpdateCartItem,removeCartItem,clearCart } from "../slices/cartSlice";
const Cart=()=>{
    const dispatch=useDispatch();
    const { items, loading, error, cartTotal, discountedTotal } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    useEffect(()=>{
dispatch(fetchCart())
    },[dispatch,token])

const handleQuantityChange = (productId,newQty) => {
dispatch(addorUpdateCartItem({productId,quantity:newQty}))
}
const handleRemove=(productId)=>{
    dispatch(removeCartItem(productId))
}
const handleClear=()=>{
dispatch(clearCart())
}
if (loading ) return <p className="text-center mt-4">Loading...</p>;
if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
return(
<div className="max-w-6xl mx-auto px-4 py-8">
    <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
    {items.length===0 ?(
        <p className="text-2xl font-bold mb-4">
            Your cart is empty.<Link to="/products" className="text-blue-500" >Shop Now  </Link>
        </p>
    ):(
        <>
        {items.map(({product,quantity})=>(
            <div key={product._id}
            className="flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-4">
                    <img src={product.mainImage?.url} className="w-20 h-20 object-cover"/>
                    <div>
                        <h4 className="font-semibold">{product.name} </h4>
                        <p >${product.price} x ${quantity}=${product.price* quantity}</p>
                        <div className="flex items-center gap 2 mt-2">
                            <button className="px-2 py-1 bg-gray-300 rounded "
                            onClick={()=>handleQuantityChange(product._id,quantity-1)}
                            disabled={quantity <= 1}
                            >-

                            </button>
                            <span>{quantity}</span>
                            <button className="px-2 py-1 bg-gray-300 rounded"
                            onClick={()=>handleQuantityChange(product._id,quantity+1)}


                            >
                                +

                            </button>
                            <button className="ml-4 text-red-500 hover:underline"
                            onClick={()=>handleRemove(product._id)}
                            >Remove</button>

                        </div>
                    </div>


                </div>


            </div>
        ))}
        <div className="mt-6 border-t pt-4">
            <p>Total: ${cartTotal}</p>
            <p className="text-green-600">Discounted Total: ${discountedTotal}</p>
            <button
              onClick={handleClear}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>
          </div>
        </>
    )}
    </div>
)}
export default Cart;
