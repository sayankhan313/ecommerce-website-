import { createAsyncThunk,createSlice,} from "@reduxjs/toolkit";


export const fetchProducts = createAsyncThunk(
    "products/fetch",
    async()=>{
        try {
            const response= await fetch('https://api.freeapi.app/api/v1/ecommerce/products')
            const data =await response.json();
            return data?.data?.products||[];

            
        } catch (error) {
            throw new Error('Failed to fetch products');
        }
    }
)

export const createProduct = createAsyncThunk(
    'products/create',
    async ({ formData, token }, thunkAPI) => {  // Changed parameters
      const state = thunkAPI.getState();
      if (state.auth.role !== 'ADMIN') {
        return thunkAPI.rejectWithValue('You do not have permission to create products.');
      }
  
      try {
        const res = await fetch('https://api.freeapi.app/api/v1/ecommerce/products', {
          method: 'POST',
          headers: {
            
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        const data = await res.json();
        if (!res.ok) {
          return thunkAPI.rejectWithValue(data.message || 'Failed to create product');
        }
        return data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Something went wrong');
      }
    }
  );

export const updateProduct=createAsyncThunk(
'products/update',
async({productId,updateData,role,token},thunkAPI)=>{
    if(role !== 'ADMIN'){
        return thunkAPI.rejectWithValue('You do not have permission to update products.');
    }
    const formData=new FormData();
    for (let key in updateData){
        formData.append(key,updateData[key]);
    }
    const res=await fetch(`https://api.freeapi.app/api/v1/ecommerce/products/${productId}`,
       { method:'PATCH',
        headers: {
            Authorization: `Bearer ${token}`
          },
        body: formData,
       }

    )
    const data=await res.json();
    if(!res.ok){
        return thunkAPI.rejectWithValue(data.message || 'Failed to update product');
    }
    return  data.data;
}


)
export const deleteProduct=createAsyncThunk(
    'products/delete',
    async({productId,token},thunkAPI)=>{
        const state = thunkAPI.getState();
        if(state.auth.role !== 'ADMIN'){
            return thunkAPI.rejectWithValue('You do not have permission to delete products.');
        }
        const res=await  fetch(`https://api.freeapi.app/api/v1/ecommerce/products/${productId}`,{
            method:'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
              }

        });
       const data= await res.json();
       if(!res.ok){
           return thunkAPI.rejectWithValue(data.message || 'Failed to delete product');
       }
       return productId;
    }
    
)

const productSlice= createSlice({
    name: 'products',
    initialState:{
        products: [],
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload;
        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload ||'Failed to fetch products';

        })
        //create product
        .addCase(createProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products.push(action.payload);
     

        })
        .addCase(createProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to create product';
        })
        //update product
        .addCase(updateProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=state.products.map(product =>
                product._id === action.payload._id ? action.payload : product

            );
        })
        .addCase(updateProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to update product';
        })
        //delete product
        .addCase(deleteProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=state.products.filter(product=>product._id !== action.payload);
        })
        .addCase(deleteProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || 'Failed to delete product';
        })


    }


});
export default productSlice.reducer;