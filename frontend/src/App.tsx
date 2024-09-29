import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import CreateProduct from './pages/product/createProduct';
import ForgotPassword from './pages/auth/forgotPassword';
import Layout from './components/Layout';
import Login from './pages/auth/login';
import ProductDetail from './pages/product/ProductDetail';
import ProductList from './components/product/ProductList';
import ResetPassword from './pages/auth/resetPassword';
import Signup from './pages/auth/signup';
import ErrorPage from './pages/error/ErrorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index={true} element={<ProductList />} />
          <Route path='/search/:keyword' element={<ProductList />} />

          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />

          <Route path='/create-product' element={<CreateProduct />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/error' element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
