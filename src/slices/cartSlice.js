
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const fetchCart= createAsyncThunk(
    'cart/fetchCart',
    async(_, thunkAPI)=>{
        const token= thunkAPI.getState().auth.token;
        if (!token){
            thunkAPI.rejectWithValue('You must be logged in to fetch the cart.');
        }
        try {
            const res =await fetch('https://api.freeapi.app/api/v1/ecommerce/cart',{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data =await res.json();
            if(!res.ok){
                return thunkAPI.rejectWithValue(data.message || 'Failed to fetch cart');
            }
            return data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
        }
    }
);
//add or update item 
export const addorUpdateCartItem=createAsyncThunk(
    'cart/addorUpdateCartItem',
    async({productId,quantity},thunkAPI)=>{
        const token=thunkAPI.getState().auth.token;
        try {
         const res = await fetch (`https://api.freeapi.app/api/v1/ecommerce/cart/item/${productId}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
         })
         const data =await res.json();
         if(!res.ok){
            return thunkAPI.rejectWithValue(data.message || 'Failed to add or update cart item');
         }
         return data.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
        }
    }

);

//remove item 
export const removeCartItem=createAsyncThunk(
    'cart/removeCartItem',
    async(productId,thunkAPI)=>{
        const token=thunkAPI.getState().auth.token;
        try {
            const res = await fetch(`https://api.freeapi.app/api/v1/ecommerce/cart/item/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                   
                        Authorization: `Bearer ${token}`
                    }
                },


            )
            const data = await res.json();
            if(!res.ok){
                return thunkAPI.rejectWithValue(data.message || 'Failed to remove cart item');
            }
            return productId;

            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
        }
    }
);
//clear cart
export const clearCart=createAsyncThunk(
    'cart/clearCart',
    async(_,thunkAPI)=>{
        const token = thunkAPI.getState().auth.token;
        try {
        const res=await fetch ('https://api.freeapi.app/api/v1/ecommerce/cart/clear',{
            method:'DELETE',
            headers:{
                Authorization: `Bearer ${token}`
            }

        })
        const data = await res.json();
        if(!res.ok){
            return thunkAPI.rejectWithValue(data.message || 'Failed to clear cart');
        }
        return [];

        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
        }
    }
)

const cartSlice = createSlice({
    name:'cart',
    initialState:{
        items:[],
        loading: false,
        error: null,
        cartTotal: 0,
        discountedTotal:0
    },
    reducers: {
        resetCart: (state) => {
          state.items = [];
          state.cartTotal = 0;
          state.discountedTotal = 0;
          state.loading = false;
          state.error = null;
        }
      },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.items=action.payload.items;
            state.cartTotal= action.payload.cartTotal;
            state.discountedTotal= action.payload.discountedTotal;

        })
        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to fetch cart';
        })
        .addCase(addorUpdateCartItem.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addorUpdateCartItem.fulfilled,(state,action)=>{
            state.loading=false;
            state.items=action.payload.items;
            state.error
        })
        .addCase(addorUpdateCartItem.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to add or update cart item';
        })
        .addCase(removeCartItem.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(removeCartItem.fulfilled,(state,action)=>{
            state.items=state.items.filter((item)=>{
                return item.product._id !== action.payload;
            })
            state.loading=false;
        })
        .addCase(removeCartItem.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to remove cart item';
        })
        .addCase(clearCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(clearCart.fulfilled,(state)=>{
            state.loading=false;
            state.items=[];
            state.cartTotal=0;
            state.discountedTotal=0;
        })
        .addCase(clearCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to clear cart';
        })

    }

})
export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;