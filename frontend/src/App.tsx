import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import Layout from './components/Layout'
// import Footer from './components/Layout/Footer';
// import Header from './components/Layout/Header';
// import HomeScreen from './pages/Home';
// import ProductDetail from './pages/ProductDetail';
// import ProductForm from './pages/ProductForm';
// import React from 'react';
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import ForgotPassword from './pages/auth/forgotPassword'
import ResetPassword from './pages/auth/resetPassword'

import Home from './pages/Home'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route index={true} path='/' element={<Home />} />
          <Route path='/search/:keyword' element={<Home />} />
          <Route path='/page/:pageNumber' element={<Home />} />
          <Route path='/search/:keyword/page/:pageNumber' element={<Home />} />
          {/* <Route path='/' element={<Home />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/add-product' element={<ProductForm />} />
            <Route path='/edit-product/:id' element={<ProductForm />} />
         */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
