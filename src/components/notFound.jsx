import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-72 h-72 bg-pink-500 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse -top-32 -left-32"></div>
        <div className="absolute w-72 h-72 bg-purple-500 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse top-0 -right-32"></div>
        <div className="absolute w-72 h-72 bg-indigo-500 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse -bottom-32 left-1/3"></div>
      </div>

      <div className="z-10 text-center px-4">
        <h1 className="text-9xl font-extrabold text-white animate-bounce drop-shadow-lg">404</h1>
        <p className="text-2xl md:text-3xl text-gray-200 mt-4">
          Oops! The page you're looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 rounded-full bg-white text-indigo-700 font-bold text-lg hover:bg-indigo-100 transition duration-300 ease-in-out animate-fade-in"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound404;
