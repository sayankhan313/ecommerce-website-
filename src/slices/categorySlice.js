import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
export const fetchCategories = createAsyncThunk(
    'categories/fetch',
    async ()=>{
        try {
            const res=await fetch('https://api.freeapi.app/api/v1/ecommerce/categories');
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message || 'Failed to fetch categories');
            }
            return data?.data.categories||[];





            
        } catch (error) {
            return Promise.reject(error.message || 'Something went wrong');
            
        }
    }



);
const categorySlice= createSlice({
    name: 'categories',
    initialState:{
        categories:[],
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCategories.fulfilled,(state,action)=>{
            state.loading = false;
            state.categories = action.payload;

        })
        .addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch categories';
        });
    }

})
export default categorySlice.reducer;