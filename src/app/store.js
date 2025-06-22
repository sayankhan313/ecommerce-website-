import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import productReducer from "../slices/productSlice";
import categoryReducer from "../slices/categorySlice";
import cartReducer from "../slices/cartSlice";



export const store =configureStore({
    reducer:{
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        cart: cartReducer,


     
    


    }
});