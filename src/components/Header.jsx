import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice"; 
import { resetCart } from "../slices/cartSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart); 

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart()); 
    navigate("/login");

  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-white">Sameer Automobiles</Link>

      <div className="space-x-4 flex items-center">
        <Link to="/products" className="hover:underline">Products</Link>

        {user?.email === "two@gmail.com" && (
          <>
            <Link to="/create-product" className="hover:underline">Create Product</Link>
            <Link to="/categories/create" className="hover:underline">Create Category</Link>
          </>
        )}

        <Link to="/cart" className="hover:underline relative">
          🛒 Cart
          {items?.length > 0 && (
            <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <span className="text-sm">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
