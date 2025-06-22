import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from "./pages/Login";
import Product from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';
import CreateProduct from './pages/CreateProduct';
import Header from './components/Header';
import CreateCategory from './pages/CreateCategory';
import Cart from './pages/Cart';

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Product/>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        
        <Route path='/products' element={<Product />} />
        <Route path='/products/:productId' element={<ProductDetails />} />
        <Route path='/products/:productId/edit' element={<EditProduct />} />
        <Route path='/create-product' element={<CreateProduct />} />
        <Route path='/categories/create' element={<CreateCategory/>}/>
        <Route path='/cart' element={<Cart/>}/>
       

       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
