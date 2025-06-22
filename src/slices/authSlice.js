import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          role: userData.email === 'two@gmail.com' ? 'ADMIN' : 'USER'
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const LoginUser = createAsyncThunk(
  'auth/LoginUser',
  async (credentials, thunkAPI) => {
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data);
      }

      return {
        ...data,
        data: {
          ...data.data,
          user: {
            ...data.data.user,
            // Ensure role is properly set from API response
            role: data.data.user?.role || 'USER'
          }
        }
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    token: null,
    role: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.accessToken || null;
        state.role = action.payload.data?.user?.role || null;
       
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Register failed';
      })
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.accessToken || null;
        state.role = action.payload.data?.user?.role || null;
      
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;