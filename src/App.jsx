import { Suspense, lazy } from 'react';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { CitiesProvider } from './context/CitiesContext';
import {AuthProvider} from './context/FakeAuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

// import Product from './pages/Product'
// import Pricing from './pages/Pricing'
// import Homepage from './pages/Homepage'
// import Login from './pages/Login'
// import AppLayout from './pages/AppLayout'
// import PageNotFound from './pages/PageNotFound'

const Homepage = lazy(()=> import('./pages/Homepage'))
const Product = lazy(()=> import('./pages/Product'))
const Pricing = lazy(()=> import('./pages/Pricing'))
const Login = lazy(()=> import('./pages/Login'))
const AppLayout = lazy(()=> import('./pages/AppLayout'))
const PageNotFound = lazy(()=> import('./pages/PageNotFound'))

// dist/assets/index-5964b7f9.css   30.15 kB │ gzip:   5.06 kB
// dist/assets/index-421822a1.js   524.71 kB │ gzip: 148.72 kB

import CityList from './components/CityList'
import CountryList from './components/CountryList'
import City from './components/City'
import Form from './components/Form'
import SpinnerFullPage from './components/SpinnerFullPage';

function App() {
  return (
    <AuthProvider>
    <CitiesProvider>
    <BrowserRouter>
    <Suspense fallback={<SpinnerFullPage />}>
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="product" element={<Product />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate replace to="cities"/>}/>
        <Route path="cities" element={<CityList />}/>
        <Route path="cities/:id" element={<City />} />
        <Route path="countries" element={<CountryList />}/>
        <Route path="form" element={<Form />}/>
      </Route>
      <Route path="login" element={<Login />}/>
      <Route path="*" element={<PageNotFound />}/>
    </Routes>
    </Suspense>
    </BrowserRouter>
    </CitiesProvider>
    </AuthProvider>
  )
}

export default App
