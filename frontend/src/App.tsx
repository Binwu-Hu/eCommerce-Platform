import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Layout from './components/Layout';

// import Footer from './components/Layout/Footer';
// import Header from './components/Layout/Header';
// import Home from './pages/Home';
// import ProductDetail from './pages/ProductDetail';
// import ProductForm from './pages/ProductForm';
// import React from 'react';
// import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        {/* <Route path='/' element={<Home />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/add-product' element={<ProductForm />} />
        <Route path='/edit-product/:id' element={<ProductForm />} />
        <Route path='/signin' element={<SignIn />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
